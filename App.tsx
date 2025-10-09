import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Textarea } from './components/ui/textarea';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { Progress } from './components/ui/progress';
import { AuthComponent } from './components/auth-component';
import { Dashboard } from './components/dashboard';
import { TransactionForm } from './components/transaction-form';
import { TransactionList } from './components/transaction-list';
import { SecurityComponent } from './components/security-component';
import { FinanceCharts } from './components/finance-charts';
import { DollarSign, LogOut, User, Settings, Sun, Moon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  attachment?: File;
  attachmentUrl?: string;
  tags: string[];
};

export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
};

export type SecurityLog = {
  id: string;
  action: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  status: 'success' | 'failed' | 'blocked';
};

const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Entretenimento',
  'Compras',
  'Investimentos',
  'Salário',
  'Freelance',
  'Outros'
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);  
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Gerenciar tema
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    toast.success(isDarkMode ? 'Tema claro ativado!' : 'Tema escuro ativado!');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    toast.success('Perfil atualizado com sucesso!');
  };

  // Simular dados iniciais
  useEffect(() => {
    if (isAuthenticated && user) {
      // Simulação de transações iniciais
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          type: 'income',
          amount: 5000,
          description: 'Salário',
          category: 'Salário',
          date: '2025-01-01',
          tags: ['mensal', 'trabalho']
        },
        {
          id: '2',
          type: 'expense',
          amount: 1200,
          description: 'Aluguel',
          category: 'Moradia',
          date: '2025-01-02',
          tags: ['mensal', 'fixo']
        },
        {
          id: '3',
          type: 'expense',
          amount: 350,
          description: 'Mercado',
          category: 'Alimentação',
          date: '2025-01-03',
          tags: ['semanal']
        },
        {
          id: '4',
          type: 'income',
          amount: 800,
          description: 'Freelance Design',
          category: 'Freelance',
          date: '2025-01-04',
          tags: ['extra']
        }
      ];
      setTransactions(mockTransactions);

      // Simulação de logs de segurança
      const mockSecurityLogs: SecurityLog[] = [
        {
          id: '1',
          action: 'Login',
          timestamp: new Date().toISOString(),
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0 Chrome/119.0.0.0',
          status: 'success'
        },
        {
          id: '2',
          action: 'Failed Login Attempt',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          ip: '203.0.113.1',
          userAgent: 'curl/7.68.0',
          status: 'blocked'
        }
      ];
      setSecurityLogs(mockSecurityLogs);
    }
  }, [isAuthenticated, user]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    
    // Log de segurança
    const newLog: SecurityLog = {
      id: Date.now().toString(),
      action: 'Login',
      timestamp: new Date().toISOString(),
      ip: '192.168.1.100',
      userAgent: navigator.userAgent,
      status: 'success'
    };
    setSecurityLogs(prev => [newLog, ...prev]);
    
    toast.success('Login realizado com sucesso!');
  };

  const handleLogout = () => {
    // Log de segurança
    const newLog: SecurityLog = {
      id: Date.now().toString(),
      action: 'Logout',
      timestamp: new Date().toISOString(),
      ip: '192.168.1.100',
      userAgent: navigator.userAgent,
      status: 'success'
    };
    setSecurityLogs(prev => [newLog, ...prev]);
    
    setUser(null);
    setIsAuthenticated(false);
    setTransactions([]);
    toast.success('Logout realizado com sucesso!');
  };

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    
    // Log de segurança
    const newLog: SecurityLog = {
      id: Date.now().toString(),
      action: `Nova Transação: ${newTransaction.type}`,
      timestamp: new Date().toISOString(),
      ip: '192.168.1.100',
      userAgent: navigator.userAgent,
      status: 'success'
    };
    setSecurityLogs(prev => [newLog, ...prev]);
    
    toast.success('Transação adicionada com sucesso!');
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    // Log de segurança
    const newLog: SecurityLog = {
      id: Date.now().toString(),
      action: 'Transação Removida',
      timestamp: new Date().toISOString(),
      ip: '192.168.1.100',
      userAgent: navigator.userAgent,
      status: 'success'
    };
    setSecurityLogs(prev => [newLog, ...prev]);
    
    toast.success('Transação removida com sucesso!');
  };

  if (!isAuthenticated) {
    return <AuthComponent onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl text-gray-900">FinanceControl</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>{user?.name}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="gap-2"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDarkMode ? 'Claro' : 'Escuro'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="transactions">Transações</TabsTrigger>
            <TabsTrigger value="add-transaction">Nova Transação</TabsTrigger>
            <TabsTrigger value="charts">Relatórios</TabsTrigger>
            <TabsTrigger value="security">Conta</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard 
              transactions={transactions} 
              user={user!}
              categories={CATEGORIES}
            />
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionList 
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
              categories={CATEGORIES}
            />
          </TabsContent>

          <TabsContent value="add-transaction">
            <TransactionForm 
              onAddTransaction={handleAddTransaction}
              categories={CATEGORIES}
            />
          </TabsContent>

          <TabsContent value="charts">
            <FinanceCharts 
              transactions={transactions}
              categories={CATEGORIES}
            />
          </TabsContent>

          <TabsContent value="security">
            <SecurityComponent 
              securityLogs={securityLogs}
              user={user!}
              transactions={transactions}
              onUpdateUser={handleUpdateUser}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

export default App;