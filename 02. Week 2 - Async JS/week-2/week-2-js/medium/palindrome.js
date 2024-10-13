/*
  Implement a function `isPalindrome` which takes a string as argument and returns true/false as its result.
  Note: the input string is case-insensitive which means 'Nan' is a palindrom as 'N' and 'n' are considered case-insensitive.
*/

function isPalindrome(str) {
  str = str.trim();
  str = str.toLowerCase();

  let low = 0,
    high = str.length - 1;

  while (low < high) {
    if (!(str[low] >= "a" && str[low] <= "z")) {
      low++;
    } else if (!(str[high] >= "a" && str[high] <= "z")) {
      high--;
    } else if (str[low] === str[high]) {
      low++;
      high--;
    } else {
      return false;
    }
  }
  return true;
}

module.exports = isPalindrome;
