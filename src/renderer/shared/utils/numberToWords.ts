export function numberToWords(num: number, currencyCode: string = 'USD'): string {
  if (num === 0) return 'Zero';

  const a = [
    '', 'One', 'Two', 'Three', 'Four',
    'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen',
    'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convert = (n: number): string => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
  };

  const whole = Math.floor(num);
  const decimal = Math.round((num - whole) * 100);
  
  let mainUnit = 'Dollars';
  if (currencyCode === 'INR') mainUnit = 'Rupees';
  else if (currencyCode === 'GBP') mainUnit = 'Pounds';
  else if (currencyCode === 'EUR') mainUnit = 'Euros';
  else if (currencyCode === 'AED') mainUnit = 'Dirhams';
  else if (currencyCode === 'SAR') mainUnit = 'Riyals';

  let words = convert(whole) + ' ' + mainUnit;
  
  if (decimal > 0) {
    let subUnit = 'Cents';
    if (currencyCode === 'INR') subUnit = 'Paise';
    else if (currencyCode === 'GBP') subUnit = 'Pence';
    else if (currencyCode === 'AED') subUnit = 'Fils';
    else if (currencyCode === 'SAR') subUnit = 'Halalas';
    
    words += ' and ' + convert(decimal) + ' ' + subUnit;
  }
  
  return words + ' Only';
}
