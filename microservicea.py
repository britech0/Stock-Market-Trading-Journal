import zmq
import json

def calculate(stock_data):
    total_performance = 0
    num_trades = 0
    profitable_trades = 0 

    for trade in stock_data.get("trades", []):
        try:
            entry_price = float(trade.get("entryPrice", 0))
            exit_price = float(trade.get("exitPrice", 0))
            stop_loss = float(trade.get("stoplossPrice", 0))

            reward = exit_price - entry_price
            max_risk = entry_price - stop_loss

            if max_risk != 0:
                risk_reward = round((reward / max_risk), 2)
            else:
                risk_reward = float('inf')  

            total_performance += risk_reward
            num_trades += 1

            if reward > 0:
                profitable_trades += 1

        except (TypeError, ValueError) as e:
            print(f"Error processing trade data: {e}")

    average_performance = round(total_performance / num_trades, 2) if num_trades > 0 else 0
    break_even_win_rate = (
        f"{round((1 / (1 + average_performance)) * 100, 2)}%" if average_performance != 0 else "N/A"
    )
    current_win_rate = (
        f"{round((profitable_trades / num_trades) * 100, 2)}%" if num_trades > 0 else "N/A"
    )

    return {
        "averagePerformance": f"{average_performance}:1" if num_trades > 0 else "N/A",
        "breakEvenWinRate": break_even_win_rate,
        "currentWinRate": current_win_rate
    }

def receive_request_send_data():
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://127.0.0.1:5555")
    print("Microservice A is running on port 5555...")

    while True:
        try:
            request = socket.recv_string()
            stock_data = json.loads(request)
            print(f"Received data: {stock_data}")

            response_data = calculate(stock_data)
            print(f"Sending response: {response_data}")

            socket.send_string(json.dumps(response_data))
        except Exception as e:
            print(f"Error: {e}")
            socket.send_string(json.dumps({"error": "Failed to process request."}))

if __name__ == "__main__":
    receive_request_send_data()
