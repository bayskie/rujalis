export interface Distribution {
  name: string;
  count: number;
  fill: string;
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
