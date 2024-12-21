import './App.css';
import { useState } from 'react';
import { Menu } from 'antd';
import LoginScreen from './LoginScreen';
import FinanceScreen from './FinanceScreen';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';  // เพิ่ม .js


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleLoginSuccess = () => setIsAuthenticated(true);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setCurrentScreen('edit');
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setCurrentScreen('finance');
  };

  const handleUpdateSuccess = () => {
    setEditingTransaction(null);
    setCurrentScreen('finance');
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const menuItems = [
    {
      key: 'dashboard',
      label: 'แดชบอร์ด',
      onClick: () => navigateTo('dashboard')
    },
    {
      key: 'finance',
      label: 'รายการธุรกรรม',
      onClick: () => navigateTo('finance')
    },
   
  ];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'finance':
        return (
          <FinanceScreen
            onEdit={handleEdit}
            editingTransaction={editingTransaction}
            setEditingTransaction={setEditingTransaction}
          />
        );
      case 'edit':
        return (
          <TransactionForm
            mode="edit"
            initialValues={editingTransaction}
            onSubmit={handleUpdateSuccess}
            onCancel={handleCancelEdit}
          />
        );
      
      default:
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="App">
      {!isAuthenticated && <LoginScreen onLoginSuccess={handleLoginSuccess} />}
      {isAuthenticated && (
        <div className="min-h-screen">
          <Menu 
            mode="horizontal" 
            theme="dark"
            selectedKeys={[currentScreen]}
            items={menuItems}
          />
          <main className="">
            {renderScreen()}
          </main>
        </div>
      )}
    </div>
  );
}

export default App;