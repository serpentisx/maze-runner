class UpdateManager {

  constructor(updater) {
    this.updater = updater;
    this.isUpdatePaused = false;
  }

  update(dt) {

    if (this.shouldSkipUpdate()) return;

    let original_dt = dt;
    if (dt > 200) {
      dt = NOMINAL_UPDATE_INTERVAL;
    }

    let du = (dt / NOMINAL_UPDATE_INTERVAL);

    this.updater(du);
  }

  shouldSkipUpdate() {
    return this.isUpdatePaused;
  }
}
