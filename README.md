<div align="center">
  <img
    width="350"
    src=".github/media/circuit-breaker.svg"
    alt="Circuit Breaker logo"
  />
</div>

<div align="center">
  <p>A concise circuit breaker implementation</p>
</div>

### ✨ Features
- ▶️ Easy start — just install and start using
- 📒 Completely documented
- 💾 Extremely lightweight and concise implementation

### What is circuit breaker?
The circuit breaker is a relatively simple design pattern. It's all based on the idea that you package protected function calls inside a circuit breaker object. This object will be responsible for monitoring possible failures.

The idea is an inspiration from the electric circuit breakers. When there is an instability in the electrical system, all electrical energy is automatically turned off by the circuit breaker. Thinking on the same, it's possible to apply the same idea to software architecture.

### What is an act?
Act is the method you want to execute and tends to be prone to failures.

###  States
- CLOSED (Default state)
- OPEN
- HALF_OPEN

### Methods
- getCurrentState()
- updateState(newState)
- executeAct(act, timePreferences, isHalfOpen)

## 📝 License
This project is licensed under the 
[MIT license](./LICENSE)

✨ Designed by Gabriel Marinho. [Follow me on GitHub!](https://github.com/gdcmarinho)