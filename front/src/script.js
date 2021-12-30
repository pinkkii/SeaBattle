const app = new Application({
    preparation: PreparationScene,
    computer: ComputerScene,
    online: OnlineScene,
});

app.start("preparation");