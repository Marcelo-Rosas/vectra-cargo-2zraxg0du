import { useEffect, useState } from 'react'
import { mockApi } from '@/services/mockApi'
import { DashboardStats } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TrendingUp,
  DollarSign,
  FileText,
  Star,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

export default function Index() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const data = await mockApi.getDashboardStats()
      setStats(data)
      setLoading(false)
    }
    loadStats()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!stats) return null

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link to="/quotation">
              <Plus className="mr-2 h-4 w-4" /> Nova Cotação
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total de Cotações"
          value={stats.totalQuotations.toString()}
          icon={FileText}
          description="+20.1% mês passado"
        />
        <StatsCard
          title="Margem Média"
          value={`${stats.averageMargin.toFixed(1)}%`}
          icon={TrendingUp}
          description="+1.2% mês passado"
        />
        <StatsCard
          title="Ticket Médio"
          value={`R$ ${stats.averageTicket.toLocaleString('pt-BR')}`}
          icon={DollarSign}
          description="+4% mês passado"
        />
        <StatsCard
          title="Favoritas"
          value={stats.favoriteQuotations.toString()}
          icon={Star}
          description="Cotações salvas"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tendência de Margem</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                margin: { label: 'Margem', color: 'hsl(var(--primary))' },
              }}
              className="h-[300px]"
            >
              <AreaChart data={stats.marginTrend}>
                <defs>
                  <linearGradient id="fillMargin" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="stroke-muted"
                />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  className="text-xs text-muted-foreground"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                  className="text-xs text-muted-foreground"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="margin"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#fillMargin)"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Distribuição de Carga</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                lotacao: { label: 'Lotação', color: 'hsl(var(--chart-1))' },
                fracionada: {
                  label: 'Fracionada',
                  color: 'hsl(var(--chart-2))',
                },
                container: { label: 'Container', color: 'hsl(var(--chart-3))' },
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={stats.cargoDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.cargoDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimas Cotações</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/history">
              Ver todas <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Origem/Destino</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor Frete</TableHead>
                <TableHead>Margem</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.recentQuotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium">
                    {quotation.name}
                  </TableCell>
                  <TableCell>
                    {quotation.originUf} → {quotation.destinationUf}
                  </TableCell>
                  <TableCell className="capitalize">
                    {quotation.cargoType}
                  </TableCell>
                  <TableCell>
                    R${' '}
                    {quotation.finalFreight.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        quotation.grossMarginPercent >= 10
                          ? 'text-green-600 font-medium'
                          : 'text-red-600 font-medium'
                      }
                    >
                      {quotation.grossMarginPercent.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={quotation.isViable ? 'default' : 'destructive'}
                    >
                      {quotation.isViable ? 'Viável' : 'Inviável'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string
  value: string
  icon: any
  description: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <Skeleton className="col-span-4 h-[400px]" />
        <Skeleton className="col-span-3 h-[400px]" />
      </div>
    </div>
  )
}
