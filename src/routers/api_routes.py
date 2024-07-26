from fastapi import APIRouter, HTTPException
from src.settings import redis_instance


router = APIRouter()


@router.post("/test/user_exit/{user_id}")
async def user_exit_new(user_id: int, coins: float, energy: float):
    redis_instance.set(f"test_counter_{user_id}", str(coins))
    redis_instance.set(f"test_energy_{user_id}", str(energy))
    return {"coins_amount": coins, "energy_amount": energy}


@router.get("/test/user_entry_check/{user_id}")
async def user_entry_check(user_id: int):
    try:
        coins = float(redis_instance.get(f"test_counter_{user_id}") or 0.0)
        energy = float(redis_instance.get(f"test_energy_{user_id}") or 1000)
    
        return {
            'energy': energy,
            'coins': coins,
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))