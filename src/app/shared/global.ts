export class Global {
  monthMaster: {
    index: number;
    value: number;
    fullName: string;
    shortName: string;
    totalDays: number;
  }[] = [
    {
      index: 0,
      value: 1,
      fullName: 'January',
      shortName: 'Jan',
      totalDays: 31,
    },
    {
      index: 1,
      value: 2,
      fullName: 'February',
      shortName: 'Feb',
      totalDays: 28, // 29 for leap years
    },
    {
      index: 2,
      value: 3,
      fullName: 'March',
      shortName: 'Mar',
      totalDays: 31,
    },
    {
      index: 3,
      value: 4,
      fullName: 'April',
      shortName: 'Apr',
      totalDays: 30,
    },
    {
      index: 4,
      value: 5,
      fullName: 'May',
      shortName: 'May',
      totalDays: 31,
    },
    {
      index: 5,
      value: 6,
      fullName: 'June',
      shortName: 'Jun',
      totalDays: 30,
    },
    {
      index: 6,
      value: 7,
      fullName: 'July',
      shortName: 'Jul',
      totalDays: 31,
    },
    {
      index: 7,
      value: 8,
      fullName: 'August',
      shortName: 'Aug',
      totalDays: 31,
    },
    {
      index: 8,
      value: 9,
      fullName: 'September',
      shortName: 'Sep',
      totalDays: 30,
    },
    {
      index: 9,
      value: 10,
      fullName: 'October',
      shortName: 'Oct',
      totalDays: 31,
    },
    {
      index: 10,
      value: 11,
      fullName: 'November',
      shortName: 'Nov',
      totalDays: 30,
    },
    {
      index: 11,
      value: 12,
      fullName: 'December',
      shortName: 'Dec',
      totalDays: 31,
    },
  ];
   
 generateYears(count: number, direction: 'before' | 'after' | 'both'): number[] {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];
  
    // Include current year
    years.push(currentYear);
  
    if (direction === 'before' || direction === 'both') {
      for (let i = 1; i <= count; i++) {
        years.unshift(currentYear - i); // Add years before the current year
      }
    }
  
    if (direction === 'after' || direction === 'both') {
      for (let i = 1; i <= count; i++) {
        years.push(currentYear + i); // Add years after the current year
      }
    }
  
    return years;
  }
  
}
