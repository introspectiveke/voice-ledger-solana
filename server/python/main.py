from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import httpx
import base64
import json

from solders.keypair import Keypair
from solders.transaction import Transaction
from solders.system_program import ID as SYS_PROGRAM_ID
from solders.message import Message
from solders.instruction import Instruction, AccountMeta
from solders.pubkey import Pubkey
from solders.hash import Hash

app = FastAPI(title="VoiceLedger API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Devnet RPC
DEVNET_RPC = "https://api.devnet.solana.com"

# Memo program on Solana
MEMO_PROGRAM_ID = Pubkey.from_string("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")

# Burner keypair for demo — generated fresh, funded via devnet airdrop
import os
_private_key_hex = os.getenv("SOLANA_PRIVATE_KEY")
if _private_key_hex:
    KEYPAIR = Keypair.from_seed(bytes.fromhex(_private_key_hex))
else:
    KEYPAIR = Keypair()


class TransactionRecord(BaseModel):
    amount: float
    description: str
    category: str
    currency: str = "KES"


class TransactionResponse(BaseModel):
    success: bool
    solana_signature: str | None = None
    memo: str | None = None
    timestamp: str
    message: str


async def airdrop_if_needed(pubkey: str):
    """Request devnet airdrop if balance is low."""
    async with httpx.AsyncClient() as client:
        # Check balance
        bal_resp = await client.post(DEVNET_RPC, json={
            "jsonrpc": "2.0", "id": 1,
            "method": "getBalance",
            "params": [pubkey]
        })
        balance = bal_resp.json().get("result", {}).get("value", 0)

        if balance < 1_000_000:  # < 0.001 SOL
            await client.post(DEVNET_RPC, json={
                "jsonrpc": "2.0", "id": 1,
                "method": "requestAirdrop",
                "params": [pubkey, 1_000_000_000]  # 1 SOL
            })


async def get_latest_blockhash() -> str:
    async with httpx.AsyncClient() as client:
        resp = await client.post(DEVNET_RPC, json={
            "jsonrpc": "2.0", "id": 1,
            "method": "getLatestBlockhash",
            "params": [{"commitment": "finalized"}]
        })
        return resp.json()["result"]["value"]["blockhash"]


async def send_memo_to_devnet(memo_text: str) -> str:
    """Write a memo transaction to Solana devnet. Returns signature."""
    pubkey = KEYPAIR.pubkey()

    await airdrop_if_needed(str(pubkey))

    blockhash_str = await get_latest_blockhash()
    blockhash = Hash.from_string(blockhash_str)

    # Build memo instruction
    memo_bytes = memo_text.encode("utf-8")
    instruction = Instruction(
        program_id=MEMO_PROGRAM_ID,
        accounts=[AccountMeta(pubkey=pubkey, is_signer=True, is_writable=False)],
        data=memo_bytes,
    )

    message = Message.new_with_blockhash(
        instructions=[instruction],
        payer=pubkey,
        blockhash=blockhash,
    )

    tx = Transaction([KEYPAIR], message, blockhash)
    tx_bytes = bytes(tx)
    tx_b64 = base64.b64encode(tx_bytes).decode()

    async with httpx.AsyncClient() as client:
        resp = await client.post(DEVNET_RPC, json={
            "jsonrpc": "2.0", "id": 1,
            "method": "sendTransaction",
            "params": [tx_b64, {"encoding": "base64"}]
        })
        result = resp.json()

        if "error" in result:
            raise Exception(result["error"]["message"])

        return result["result"]  # transaction signature


@app.post("/record-transaction", response_model=TransactionResponse)
async def record_transaction(record: TransactionRecord):
    timestamp = datetime.utcnow().isoformat()

    memo = (
        f"VoiceLedger | {record.currency} {record.amount:.2f} | "
        f"{record.category} | {record.description[:50]} | {timestamp}"
    )

    try:
        signature = await send_memo_to_devnet(memo)
        return TransactionResponse(
            success=True,
            solana_signature=signature,
            memo=memo,
            timestamp=timestamp,
            message="Transaction recorded on Solana devnet"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "wallet": str(KEYPAIR.pubkey()),
        "network": "devnet"
    }


@app.get("/")
async def root():
    return {"app": "VoiceLedger API", "version": "1.0.0"}
