import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  FileImage,
  FileText,
  AlertTriangle
} from 'lucide-react';
import type { Transaction } from '../App';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  categories: string[];
}

export function TransactionList({ transactions, onDeleteTransaction, categories }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        transaction.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesCategory = filterCategory === 'all' || 
        transaction.category === filterCategory;
      
      const matchesType = filterType === 'all' || 
        transaction.type === filterType;

      return matchesSearch && matchesCategory && matchesType;
    });

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, searchTerm, filterCategory, filterType, sortBy, sortOrder]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const totalIncome = filteredAndSortedTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredAndSortedTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleDeleteWithConfirmation = (transaction: Transaction) => {
    if (window.confirm(`Tem certeza que deseja excluir a transação "${transaction.description}"?`)) {
      onDeleteTransaction(transaction.id);
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor', 'Tags'].join(','),
      ...filteredAndSortedTransactions.map(t => [
        t.date,
        t.type === 'income' ? 'Receita' : 'Despesa',
        `"${t.description}"`,
        t.category,
        t.amount.toString().replace('.', ','),
        `"${t.tags.join('; ')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `transacoes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Resumo rápido */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Transações</p>
                <p className="text-2xl font-bold">{filteredAndSortedTransactions.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Receitas</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Despesas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Histórico de Transações
              </CardTitle>
              <CardDescription>
                Gerencie e visualize todas as suas transações financeiras
              </CardDescription>
            </div>
            <Button onClick={exportTransactions} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filtros e busca */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar transações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Data (mais recente)</SelectItem>
                <SelectItem value="date-asc">Data (mais antiga)</SelectItem>
                <SelectItem value="amount-desc">Valor (maior)</SelectItem>
                <SelectItem value="amount-asc">Valor (menor)</SelectItem>
                <SelectItem value="description-asc">Descrição (A-Z)</SelectItem>
                <SelectItem value="description-desc">Descrição (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabela de transações */}
          {filteredAndSortedTransactions.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('date')}
                    >
                      Data {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('description')}
                    >
                      Descrição {sortBy === 'description' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('category')}
                    >
                      Categoria {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50 text-right"
                      onClick={() => handleSort('amount')}
                    >
                      Valor {sortBy === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'}>
                          {transaction.type === 'income' ? (
                            <><TrendingUp className="h-3 w-3 mr-1" />Receita</>
                          ) : (
                            <><TrendingDown className="h-3 w-3 mr-1" />Despesa</>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {transaction.attachment && (
                            transaction.attachment.type.startsWith('image/') ? (
                              <FileImage className="h-4 w-4 text-blue-500" />
                            ) : (
                              <FileText className="h-4 w-4 text-red-500" />
                            )
                          )}
                          {transaction.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category}</Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {transaction.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {transaction.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{transaction.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedTransaction(transaction)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Detalhes da Transação</DialogTitle>
                                <DialogDescription>
                                  Informações completas da transação selecionada
                                </DialogDescription>
                              </DialogHeader>
                              {selectedTransaction && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-sm text-gray-600">Tipo</p>
                                      <Badge variant={selectedTransaction.type === 'income' ? 'default' : 'secondary'}>
                                        {selectedTransaction.type === 'income' ? 'Receita' : 'Despesa'}
                                      </Badge>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Valor</p>
                                      <p className={`font-medium ${
                                        selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                      }`}>
                                        {formatCurrency(selectedTransaction.amount)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Data</p>
                                      <p>{formatDate(selectedTransaction.date)}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm text-gray-600">Categoria</p>
                                      <p>{selectedTransaction.category}</p>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-600">Descrição</p>
                                    <p>{selectedTransaction.description}</p>
                                  </div>
                                  {selectedTransaction.tags.length > 0 && (
                                    <div>
                                      <p className="text-sm text-gray-600 mb-2">Tags</p>
                                      <div className="flex flex-wrap gap-2">
                                        {selectedTransaction.tags.map((tag, index) => (
                                          <Badge key={index} variant="outline">
                                            {tag}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {selectedTransaction.attachment && (
                                    <div>
                                      <p className="text-sm text-gray-600 mb-2">Anexo</p>
                                      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        {selectedTransaction.attachment.type.startsWith('image/') ? (
                                          <FileImage className="h-5 w-5 text-blue-500" />
                                        ) : (
                                          <FileText className="h-5 w-5 text-red-500" />
                                        )}
                                        <span>{selectedTransaction.attachment.name}</span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteWithConfirmation(transaction)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg mb-2">Nenhuma transação encontrada</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterCategory !== 'all' || filterType !== 'all'
                  ? 'Tente ajustar os filtros para ver mais resultados.'
                  : 'Adicione sua primeira transação para começar.'}
              </p>
              {(searchTerm || filterCategory !== 'all' || filterType !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                    setFilterType('all');
                  }}
                >
                  Limpar Filtros
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dica para o usuário */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>💡 Dica:</strong> Use os filtros para encontrar transações específicas e acompanhar seus gastos por categoria. Você pode exportar seus dados a qualquer momento.
        </AlertDescription>
      </Alert>
    </div>
  );
}