<img width="1024" height="1024" alt="bg" src="https://github.com/user-attachments/assets/596ce51b-1fdb-48d5-8697-d44c3f723cd3" />

# 🏎️ Vanilla Racer (Gemini Refactor)

A high-performance, top-down 2D racing engine built with **Vanilla JavaScript** and **HTML5 Canvas**. This project focuses on modular architecture, procedural track generation, and custom physics implementation without external dependencies.

---

## 🤖 Built with Gemini 3 Flash
This project was developed in collaboration with **Gemini 3 Flash**, Google’s state-of-the-art AI. The architecture was refactored from a monolithic script into a highly decoupled, modular system to improve performance, maintainability, and scalability. Gemini assisted in:
* **Physics Engine Design**: Implementing elastic collision math and SAT-based boundary constraints.
* **Architecture Refactoring**: Transitioning to a System-based (ECS-lite) approach.
* **Procedural Logic**: Developing the "Infinity Mode" level transition logic.

---

## 🌟 Key Features

* **Modular Architecture**: Clean separation of concerns between core logic, physics systems, and controllers.
* **Custom Physics Engine**: Real-time elastic car-to-car collisions and off-road friction simulation.
* **AI Pathfinding**: Intelligent competitors that utilize spline-based navigation to challenge the player.
* **Dynamic Visuals**: Canvas-based camera system with smooth interpolation, screen shake, and persistent skid marks.

---

## 📂 Project Structure

The engine is split into specialized modules:

```text
├── src/
│   ├── controllers/
│   │   ├── AIController.js    # Logic for path following & bot behavior
│   │   └── InputHandler.js    # Keyboard mapping for player control
│   ├── core/
│   │   └── GameLoop.js        # Delta-time based timing engine
│   ├── entities/
│   │   └── Car.js             # Vehicle state & drawing logic
│   ├── render/
│   │   └── Renderer.js        # Canvas context & camera transforms
│   ├── systems/
│   │   ├── CollisionSystem.js # SAT/Elastic physics & track boundaries
│   │   ├── Environment.js     # World decoration generation
│   │   └── SkidSystem.js      # Particle management for tire trails
│   ├── track/
│   │   └── Track.js           # Spline-based track & grid generation
│   ├── ui/
│   │   ├── MiniMap.js         # Real-time UI overview
│   │   └── UIManager.js       # HUD & Game state management
├── main.js                    # The Orchestrator (Game Engine)
└── index.html                 # Entry point
