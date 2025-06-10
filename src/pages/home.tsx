import { useAnalyticQuery } from "@/hooks/use-analytic-query";
import DefaultLayout from "@/layout/default";
import { formatLength } from "@/lib/format-length";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticChartCard } from "@/components/analytic-chart-card";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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
            Rujal AI{" "}
            <Sparkles
              className="inline animate-pulse text-violet-700"
              size={16}
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!data?.insight && (
            <div className="space-y-2">
              <Skeleton className="h-4 max-w-2/3" />
              <Skeleton className="h-4 max-w-1/3" />
            </div>
          )}
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
              {!data?.roadCount && <Skeleton className="h-9 w-24" />}
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
              {data?.roadLengthTotal !== undefined ? (
                <p className="text-3xl font-semibold">
                  {formatLength(Number(data.roadLengthTotal))}
                </p>
              ) : (
                <Skeleton className="h-9 w-24 rounded-md" />
              )}

              {data?.roadLengthAvg !== undefined ? (
                <p className="text-3xl font-semibold">
                  {formatLength(Number(data.roadLengthAvg))}
                </p>
              ) : (
                <Skeleton className="h-9 w-24 rounded-md" />
              )}
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
              {data?.roadWidthTotal !== undefined ? (
                <p className="text-3xl font-semibold">
                  {formatLength(Number(data.roadWidthTotal))}
                </p>
              ) : (
                <Skeleton className="h-9 w-24 rounded-md" />
              )}

              {data?.roadWidthAvg !== undefined ? (
                <p className="text-3xl font-semibold">
                  {formatLength(Number(data.roadWidthAvg))}
                </p>
              ) : (
                <Skeleton className="h-9 w-24 rounded-md" />
              )}
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
          type="roadCondition"
        />

        {/* Road Segments Type */}
        <AnalyticChartCard
          title="Jenis"
          subttitle="Grafik jenis ruas jalan"
          data={data?.roadTypeDistribution ?? []}
          type="roadType"
        />

        {/* Road Segments Material */}
        <AnalyticChartCard
          title="Material"
          subttitle="Grafik material ruas jalan"
          data={data?.roadMaterialDistribution ?? []}
          type="roadMaterial"
        />
      </div>
    </DefaultLayout>
  );
}
