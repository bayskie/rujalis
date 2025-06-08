import { useAnalyticQuery } from "@/hooks/use-analytic-query";
import DefaultLayout from "@/layout/default";
import { formatLength } from "@/lib/format-length";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticChartCard } from "@/components/analytic-chart-card";
import { Sparkles } from "lucide-react";

export default function Home() {
  const { data } = useAnalyticQuery();
  return (
    <DefaultLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Beranda</h1>
        <h3 className="text-muted-foreground text-sm">
          Statistik dan kondisi terkini ruas jalan
        </h3>
      </div>

      {/* Generated insight */}
      <Card className="mb-4 w-full gap-2">
        <CardHeader>
          <CardTitle className="text-muted-foreground text-sm font-normal">
            Rujal AI <Sparkles className="inline" size={16} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{data?.insight}</p>
        </CardContent>
      </Card>

      <div className="mb-4 grid w-full grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Road Segments Count */}
        <div className="col-span-1">
          <Card className="w-full gap-2">
            <CardHeader>
              <CardTitle className="text-muted-foreground text-sm font-normal">
                Jumlah ruas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{data?.roadCount}</p>
            </CardContent>
          </Card>
        </div>

        {/* Road Segments Length */}
        <div className="col-span-1 lg:col-span-2">
          <Card className="w-full gap-2">
            <CardHeader className="grid grid-cols-2">
              <CardTitle className="text-muted-foreground text-sm font-normal">
                Total panjang
              </CardTitle>
              <CardTitle className="text-muted-foreground text-sm font-normal">
                Rata-rata panjang
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2">
              <p className="text-3xl font-semibold">
                {formatLength(Number(data?.roadLengthTotal ?? 0))}
              </p>
              <p className="text-3xl font-semibold">
                {formatLength(Number(data?.roadLengthAvg ?? 0))}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Road Segments Width */}
        <div className="col-span-1 lg:col-span-2">
          <Card className="w-full gap-2">
            <CardHeader className="grid grid-cols-2">
              <CardTitle className="text-muted-foreground text-sm font-normal">
                Total lebar
              </CardTitle>
              <CardTitle className="text-muted-foreground text-sm font-normal">
                Rata-rata lebar
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2">
              <p className="text-3xl font-semibold">
                {formatLength(Number(data?.roadWidthTotal ?? 0))}
              </p>
              <p className="text-3xl font-semibold">
                {formatLength(Number(data?.roadWidthAvg ?? 0))}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Road Segments Condition */}
        <AnalyticChartCard
          title="Kondisi"
          subttitle="Grafik kondisi ruas jalan"
          data={data?.roadConditionDistribution ?? []}
        />

        {/* Road Segments Type */}
        <AnalyticChartCard
          title="Jenis"
          subttitle="Grafik jenis ruas jalan"
          data={data?.roadTypeDistribution ?? []}
        />

        {/* Road Segments Material */}
        <AnalyticChartCard
          title="Material"
          subttitle="Grafik material ruas jalan"
          data={data?.roadMaterialDistribution ?? []}
        />
      </div>
    </DefaultLayout>
  );
}
