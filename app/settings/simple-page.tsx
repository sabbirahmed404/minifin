'use client';

import { useState } from 'react';
import { useFinance } from '../lib/data/FinanceContext';
import { useCurrency, currencies, type CurrencyCode } from '../lib/data/CurrencyContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Download, Trash2 } from 'lucide-react';
import AppLayout from '../AppLayout';
import FirebaseSettings from './firebase-settings';

export default function Settings() {
  const { transactions } = useFinance();
  const { currentCurrency, setCurrency } = useCurrency();
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  
  // Export data function
  const exportData = () => {
    // In a real app, this would download a JSON file with the transactions
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `minifin-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as CurrencyCode);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4 bg-[#09122C] border border-[#BE3144]/30">
            <TabsTrigger value="general" className="data-[state=active]:bg-[#872341] data-[state=active]:text-white">
              General
            </TabsTrigger>
            <TabsTrigger value="data" className="data-[state=active]:bg-[#872341] data-[state=active]:text-white">
              Data Management
            </TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-[#872341] data-[state=active]:text-white">
              Integrations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <Card className="bg-card border-[#BE3144]/30">
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <p className="text-sm text-muted-foreground">Customize how MiniFin looks</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme for the application
                    </p>
                  </div>
                  <div className="h-6 w-11 rounded-full bg-[#872341] relative cursor-pointer">
                    <div className="h-5 w-5 rounded-full bg-white absolute top-0.5 right-0.5"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="font-medium">Currency</p>
                  <div className="flex gap-2">
                    <select 
                      className="flex h-10 w-full rounded-md border border-[#BE3144]/30 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={currentCurrency.code}
                      onChange={handleCurrencyChange}
                    >
                      <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                      <option value="GBP">GBP (£) - British Pound</option>
                      <option value="JPY">JPY (¥) - Japanese Yen</option>
                      <option value="CAD">CAD (C$) - Canadian Dollar</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-4">
            <Card className="bg-card border-[#BE3144]/30">
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
                <p className="text-sm text-muted-foreground">Download your transaction data</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">Export your transaction data as a JSON file that you can backup or import into other applications.</p>
                
                <div className="flex flex-col space-y-2">
                  <Button onClick={exportData} className="bg-[#872341] hover:bg-[#872341]/80">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  
                  {showExportSuccess && (
                    <div className="flex items-center p-2 bg-green-500/10 rounded text-green-500">
                      <span className="text-sm">Data exported successfully!</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-[#BE3144]/30">
              <CardHeader>
                <CardTitle>Delete All Data</CardTitle>
                <p className="text-sm text-muted-foreground">Remove all your transaction data</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-red-500">Warning: This action cannot be undone. All of your data will be permanently deleted.</p>
                
                <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete All Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations" className="space-y-4">
            <FirebaseSettings />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
} 