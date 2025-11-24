

export interface QuicksearchOpt {
    label: string;
    value: string;
  }
  export function createQuicksearchOption(categories: string[]): QuicksearchOpt[] {
    return categories.map((category) => ({
      label: category,
      value: category
    }));
  }