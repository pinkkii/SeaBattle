const app = new Application({
    preparation: PreparationScene,
    computer: ComputerScene,
    online: OnlineScene,
});

app.start("preparation");

document.querySelector(`[data-type="random"]`).click();