class Ship {
  constructor(shipYard, shipType) {
    this.shipYard = shipYard;
    this.shipType = shipType;
    this.positions = [];
    this.damages = [];
  }

  getPositions() {
    return this.positions;
  }
}

class ShipL extends Ship {
  constructor() {}
}
