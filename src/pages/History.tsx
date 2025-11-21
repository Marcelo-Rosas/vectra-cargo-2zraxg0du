import { useState, useEffect } from 'react'
import { mockApi } from '@/services/mockApi'
import { Quotation } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Search, Filter, FileDown, Eye, ArrowRightLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function History() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      const data = await mockApi.getQuotations()
      setQuotations(data)
      setLoading(false)
    }
    loadData()
  }, [])

  const filteredQuotations = quotations.filter(
    (q) =>
      q.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.originUf.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.destinationUf.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    )
  }

  const handleCompare = () => {
    if (selectedIds.length < 2) return
    navigate(`/comparison?ids=${selectedIds.join(',')}`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Histórico de Cotações
        </h2>
        <div className="flex gap-2 w-full md:w-auto">
          {selectedIds.length >= 2 && (
            <Button onClick={handleCompare} className="animate-fade-in">
              <ArrowRightLeft className="mr-2 h-4 w-4" /> Comparar (
              {selectedIds.length})
            </Button>
          )}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cotação..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas as Cotações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Rota</TableHead>
                <TableHead>Carga</TableHead>
                <TableHead>Valor Frete</TableHead>
                <TableHead>Margem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuotations.map((q) => (
                  <TableRow key={q.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(q.id)}
                        onCheckedChange={() => toggleSelection(q.id)}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(q.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{q.name}</TableCell>
                    <TableCell>
                      {q.originUf} → {q.destinationUf}
                    </TableCell>
                    <TableCell className="capitalize">{q.cargoType}</TableCell>
                    <TableCell>
                      R${' '}
                      {q.finalFreight.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          q.grossMarginPercent >= 10
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        {q.grossMarginPercent.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {q.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <FileDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
