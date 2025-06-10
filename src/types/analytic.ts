export interface Distribution {
  id: string;
  name: string;
  count: number;
}

export interface Analytic {
  roadCount: number;
  roadLengthTotal: number;
  roadLengthAvg: number;
  roadWidthTotal: number;
  roadWidthAvg: number;
  roadConditionDistribution: Distribution[];
  roadTypeDistribution: Distribution[];
  roadMaterialDistribution: Distribution[];
  insight: string;
}
