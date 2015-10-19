module.exports = {
  addZero: function addZero(num) {
    if (num < 10) {
      num = "0" + num;
    }
    return num;
  }
};