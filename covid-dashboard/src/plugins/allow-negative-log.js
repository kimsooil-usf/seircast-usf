export default function (H) {
  // Pass error messages
  H.Axis.prototype.allowNegativeLog = true;

  // Override conversions
  H.Axis.prototype.log2lin = function (num) {
    let isNegative = num < 0,
      adjustedNum = Math.abs(num),
      result;
    if (adjustedNum < 10) {
      adjustedNum += (10 - adjustedNum) / 10;
    }
    result = Math.log(adjustedNum) / Math.LN10;
    return isNegative ? -result : result;
  };
  H.Axis.prototype.lin2log = function (num) {
    let isNegative = num < 0,
      absNum = Math.abs(num),
      result = Math.pow(10, absNum);
    if (result < 10) {
      result = (10 * (result - 1)) / (10 - 1);
    }
    return isNegative ? -result : result;
  };
}
