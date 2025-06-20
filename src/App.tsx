import { useState, useMemo } from 'react';
import { Calculator, DollarSign, Users, TrendingUp, Plus, X, CheckCircle2 } from 'lucide-react';
import './App.css';

// Base license cost
const BASE_LICENSE_COST = 15000;

// Tenant plans data
const tenantPlans = [
  {
    id: 'micro',
    name: 'Micro Client',
    sku: 'MSSP-TENANT-MICRO',
    price: 3000,
    identifiers: 25,
    features: 'Basic tenant',
    color: 'from-emerald-400 to-teal-500',
    textColor: 'text-emerald-600'
  },
  {
    id: 'starter',
    name: 'Starter Client', 
    sku: 'MSSP-TENANT-STARTER',
    price: 7000,
    identifiers: 100,
    features: 'Basic tenant + Threat Flow Generated Intelligence',
    color: 'from-blue-400 to-indigo-500',
    textColor: 'text-blue-600'
  },
  {
    id: 'essential',
    name: 'Essential Client',
    sku: 'MSSP-TENANT-ESSENTIAL', 
    price: 12000,
    identifiers: 400,
    features: 'Starter + Basic Alert Integrations',
    color: 'from-purple-400 to-violet-500',
    textColor: 'text-purple-600'
  },
  {
    id: 'core',
    name: 'Core Customer',
    sku: 'MSSP-TENANT-CORE',
    price: 28000,
    identifiers: 1000,
    features: 'Essential + Custom Intelligence, Unlimited View-Only licenses, Global Search',
    color: 'from-orange-400 to-red-500',
    textColor: 'text-orange-600'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Customer',
    sku: 'MSSP-TENANT-ENTERPRISE',
    price: 50000,
    identifiers: 4000,
    features: 'Full feature set',
    color: 'from-indigo-400 to-purple-600',
    textColor: 'text-indigo-600'
  }
];

// Add-on options
const addOnOptions = [
  // Add-Ons for Tenant-Model MSSP (requires FP-BASE-PROVIDER SKU)
  {
    id: 'individual-takedown',
    name: 'Individual Takedowns',
    sku: 'MSSP-TD-1',
    price: 500,
    category: 'MSSP',
    icon: '🎯'
  },
  {
    id: 'bulk-takedowns',
    name: '10 takedowns – Valid until renewal',
    sku: 'MSSP-TD-10',
    price: 3000,
    category: 'MSSP',
    icon: '🎯'
  },
  {
    id: 'additional-searches-100',
    name: 'Additional 100 searches per month (UI and API)',
    sku: 'MSSP-SEARCHES-100',
    price: 5000,
    category: 'MSSP',
    icon: '🔍'
  },
  {
    id: 'additional-searches-200',
    name: 'Additional 200 searches per month (UI and API)',
    sku: 'MSSP-SEARCHES-200',
    price: 8000,
    category: 'MSSP',
    icon: '🔍'
  },
  // Add-Ons to End-Customers Tenants (requires tenant SKU)
  {
    id: 'supply-chain-micro',
    name: 'Supply Chain Exposure (Micro Tenant Only)',
    sku: 'MSSP-T-SUPPLYCHAIN-M',
    price: 3000,
    category: 'Tenant',
    icon: '🔗'
  },
  {
    id: 'supply-chain-all',
    name: 'Supply Chain Exposure (For All other Tenants)',
    sku: 'MSSP-T-SUPPLYCHAIN',
    price: 8000,
    category: 'Tenant',
    icon: '🔗'
  },
  {
    id: 'view-licenses',
    name: 'Unlimited End-customer view-only licenses',
    sku: 'MSSP-T-VIEW-LICENSES',
    price: 750,
    category: 'Tenant',
    icon: '👥'
  },
  {
    id: 'additional-identifiers-25',
    name: 'Additional 25 identifiers',
    sku: 'MSSP-T-IDENT-25',
    price: 500,
    category: 'Tenant',
    icon: '🔢'
  },
  {
    id: 'additional-identifiers-100',
    name: 'Additional 100 identifiers',
    sku: 'MSSP-T-IDENT-100',
    price: 1200,
    category: 'Tenant',
    icon: '🔢'
  },
  {
    id: 'additional-identifiers-200',
    name: 'Additional 200 identifiers',
    sku: 'MSSP-T-IDENT-200',
    price: 2000,
    category: 'Tenant',
    icon: '🔢'
  },
  {
    id: 'additional-identifiers-500',
    name: 'Additional 500 identifiers',
    sku: 'MSSP-T-IDENT-500',
    price: 4500,
    category: 'Tenant',
    icon: '🔢'
  },
  {
    id: 'additional-identifiers-1000',
    name: 'Additional 1000 identifiers',
    sku: 'MSSP-T-IDENT-1000',
    price: 8000,
    category: 'Tenant',
    icon: '🔢'
  },
  {
    id: 'additional-identifiers-10k',
    name: 'Additional 10,000 identifiers',
    sku: 'MSSP-T-IDENT-10k',
    price: 20000,
    category: 'Tenant',
    icon: '🔢'
  },
  {
    id: 'threat-flow-custom',
    name: 'Threat Flow Custom Generated Intelligence and Threat Flow Explorer',
    sku: 'MSSP-T-TFCUSTOM',
    price: 8000,
    category: 'Tenant',
    icon: '🧠'
  }
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [selectedTenants, setSelectedTenants] = useState<any[]>([]);
  const [addOns, setAddOns] = useState<{ [key: string]: number }>({});
  const [markup, setMarkup] = useState(50);
  const [billingPeriod, setBillingPeriod] = useState('annual');
  const [showClientNameModal, setShowClientNameModal] = useState(false);
  const [pendingTenant, setPendingTenant] = useState<any>(null);
  const [clientName, setClientName] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Flare-MSSP') {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const addTenant = (plan: any) => {
    setPendingTenant(plan);
    setShowClientNameModal(true);
    setClientName('');
  };

  const confirmAddTenant = () => {
    if (pendingTenant && clientName.trim()) {
      const newTenant = {
        ...pendingTenant,
        id: Date.now().toString(),
        originalId: pendingTenant.id,
        clientName: clientName.trim()
      };
      setSelectedTenants([...selectedTenants, newTenant]);
      setShowClientNameModal(false);
      setPendingTenant(null);
      setClientName('');
    }
  };

  const cancelAddTenant = () => {
    setShowClientNameModal(false);
    setPendingTenant(null);
    setClientName('');
  };

  const removeTenant = (id: string) => {
    setSelectedTenants(selectedTenants.filter(tenant => tenant.id !== id));
  };

  const updateAddOn = (addOnId: string, quantity: number) => {
    setAddOns({
      ...addOns,
      [addOnId]: quantity
    });
  };

  const calculations = useMemo(() => {
    const tenantsCost = selectedTenants.reduce((sum, tenant) => sum + tenant.price, 0);
    const addOnsCost = Object.entries(addOns).reduce((sum, [addOnId, quantity]) => {
      const addOn = addOnOptions.find(ao => ao.id === addOnId);
      return sum + (addOn ? addOn.price * quantity : 0);
    }, 0);
    
    // Base license cost (MSSP cost only - not charged to customers)
    const baseLicenseCost = BASE_LICENSE_COST;
    
    // Tenant costs - charged to customers WITH markup applied
    const markedUpTenantsCost = tenantsCost * (1 + markup / 100);
    
    // Add-ons get markup applied (additional services MSSPs sell)
    const markedUpAddOnsCost = addOnsCost * (1 + markup / 100);
    
    // MSSP total costs = base license + tenant costs + add-on costs
    const totalCost = baseLicenseCost + tenantsCost + addOnsCost;
    
    // Customer price = tenant costs (with markup) + add-ons (with markup)
    // NOTE: Base license is NOT charged to customers
    const customerPrice = markedUpTenantsCost + markedUpAddOnsCost;
    
    const monthlyCustomerPrice = customerPrice / 12;
    const monthlyCost = totalCost / 12;
    const profit = customerPrice - totalCost;
    const monthlyProfit = profit / 12;
    const profitMargin = customerPrice > 0 ? (profit / customerPrice) * 100 : 0;

    return {
      totalCost,
      customerPrice,
      monthlyCustomerPrice,
      monthlyCost,
      profit,
      monthlyProfit,
      profitMargin,
      displayCost: billingPeriod === 'annual' ? totalCost : monthlyCost,
      displayCustomerPrice: billingPeriod === 'annual' ? customerPrice : monthlyCustomerPrice,
      displayProfit: billingPeriod === 'annual' ? profit : monthlyProfit
    };
  }, [selectedTenants, addOns, markup, billingPeriod]);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🔒</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              MSSP ROI Calculator
            </h1>
            <p className="text-gray-600 text-sm">
              Please enter the access password to continue
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-gray-900"
                placeholder="Enter password"
                autoFocus
                required
              />
            </div>
            
            {passwordError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm font-medium">{passwordError}</p>
              </div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              Access Calculator
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4">
      {/* Client Name Modal */}
      {showClientNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Add Client Name</h3>
              <p className="text-sm text-gray-600">
                Enter a name for this <span className="font-semibold text-blue-600">{pendingTenant?.name}</span> client
              </p>
            </div>
            
            <div className="mb-6">
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Please refrain from using actual client names for security"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-center text-gray-900"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && clientName.trim()) {
                    confirmAddTenant();
                  }
                }}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelAddTenant}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmAddTenant}
                disabled={!clientName.trim()}
                className={`flex-1 py-2 px-4 rounded-lg transition-all duration-200 ${
                  clientName.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add Client
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg mr-3">
              <Calculator className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MSSP ROI Calculator
              </h1>
              <div className="h-0.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mx-auto mt-1"></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Calculate your MSSP costs and determine customer pricing with our comprehensive ROI calculator
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Base License Card */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="text-center mb-3">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg mr-2">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Base MSSP License</h2>
                </div>
                <p className="text-sm text-blue-600 font-medium">Foundation Platform</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-sm font-semibold text-blue-700">Required Foundation License</span>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed mb-3 max-w-xl mx-auto">
                  Includes: 100 identifiers, Global Search Bar & Search API (100 searches/month), SSO & MFA, 
                  Supply Chain Exposure, Threat Flow Intelligence, Alerts, SIEM/SOAR Integrations
                </p>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                    ${BASE_LICENSE_COST.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">per year</div>
                </div>
              </div>
            </div>

            {/* Customer Tenants Card */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-lg mr-2">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Customer Tenant Selection</h2>
                </div>
                <p className="text-sm text-emerald-600 font-medium">Choose Your Client Tiers</p>
              </div>

              {/* Tenant Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-4">
                {tenantPlans.map((plan) => (
                  <div 
                    key={plan.id} 
                    className="group relative bg-white border border-gray-200 rounded-lg p-3 hover:border-transparent hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => addTenant(plan)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300`}></div>
                    
                    <div className="relative text-center">
                      <div className="mb-2">
                        <h3 className="text-sm font-bold text-gray-800 mb-1">{plan.name}</h3>
                        <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-full text-center">{plan.sku}</p>
                      </div>
                      
                      <div className="mb-2">
                        <div className={`text-lg font-bold ${plan.textColor} mb-1`}>${plan.price.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">per year</div>
                      </div>
                      
                      <div className="space-y-1 mb-3">
                        <div className="text-xs font-medium text-gray-800">
                          {plan.identifiers.toLocaleString()} identifiers
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">{plan.features}</div>
                      </div>
                      
                      <button className={`w-full bg-gradient-to-r ${plan.color} text-white py-2 px-3 rounded-md text-xs font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center`}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add Tenant
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Tenants */}
              {selectedTenants.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-bold text-gray-800 mb-1">Selected Tenants</h3>
                    <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold inline-block">
                      {selectedTenants.length} Active Client{selectedTenants.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedTenants.map((tenant) => (
                      <div key={tenant.id} className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 bg-gradient-to-r ${tenant.color} rounded-full mr-2`}></div>
                            <div>
                              <div className="text-sm font-semibold text-gray-800">{tenant.clientName}</div>
                              <div className="text-xs text-gray-500">{tenant.name} • {tenant.identifiers.toLocaleString()} identifiers</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-bold ${tenant.textColor}`}>${tenant.price.toLocaleString()}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTenant(tenant.id);
                              }}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors duration-200"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add-ons Card */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-lg mr-2">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-800">Add-ons & Enhancements</h2>
                </div>
                <p className="text-sm text-purple-600 font-medium">Extend Your Platform Capabilities</p>
              </div>

              {/* MSSP Add-ons */}
              <div className="mb-4">
                <div className="text-center mb-3">
                  <h3 className="text-sm font-bold text-gray-800 mb-1">MSSP Add-ons</h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {addOnOptions.filter(ao => ao.category === 'MSSP').map((addOn) => (
                    <div key={addOn.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="text-center">
                        <div className="text-lg mb-1">{addOn.icon}</div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">{addOn.name}</h4>
                        <p className="text-xs text-gray-500 font-mono mb-2">{addOn.sku}</p>
                        <div className="text-sm font-bold text-purple-600 mb-2">${addOn.price.toLocaleString()}</div>
                        <div className="flex items-center justify-center space-x-2">
                          <label className="text-xs text-gray-600 font-medium">Qty:</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={addOns[addOn.id] || ''}
                            onChange={(e) => updateAddOn(addOn.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-gray-200 rounded text-center text-xs font-semibold text-gray-900 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tenant Add-ons */}
              <div>
                <div className="text-center mb-3">
                  <h3 className="text-sm font-bold text-gray-800 mb-1">End-Customer Tenant Add-ons</h3>
                  <div className="w-12 h-0.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full mx-auto"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {addOnOptions.filter(ao => ao.category === 'Tenant').map((addOn) => (
                    <div key={addOn.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="text-center">
                        <div className="text-lg mb-1">{addOn.icon}</div>
                        <h4 className="text-sm font-semibold text-gray-800 mb-1">{addOn.name}</h4>
                        <p className="text-xs text-gray-500 font-mono mb-2">{addOn.sku}</p>
                        <div className="text-sm font-bold text-emerald-600 mb-2">${addOn.price.toLocaleString()}</div>
                        <div className="flex items-center justify-center space-x-2">
                          <label className="text-xs text-gray-600 font-medium">Qty:</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={addOns[addOn.id] || ''}
                            onChange={(e) => updateAddOn(addOn.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 border border-gray-200 rounded text-center text-xs font-semibold text-gray-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-4 lg:sticky lg:top-4 lg:self-start">
            
            {/* Pricing Controls Card */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Pricing Controls</h2>
                <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>
              </div>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mb-3">
                    <label className="text-xs font-semibold text-gray-700 block mb-1">Markup Percentage</label>
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold inline-block mb-2">
                      {markup.toFixed(0)}%
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-gray-500 font-medium">10%</span>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="10"
                        max="100"
                        step="5"
                        value={markup}
                        onChange={(e) => setMarkup(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">100%</span>
                  </div>
                </div>

                <div className="text-center">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Billing Period</label>
                  <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-lg">
                    <button
                      onClick={() => setBillingPeriod('monthly')}
                      className={`py-2 px-3 text-xs font-semibold rounded-md transition-all duration-200 ${
                        billingPeriod === 'monthly'
                          ? 'bg-white text-blue-600 shadow-md transform scale-105'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      📅 Monthly
                    </button>
                    <button
                      onClick={() => setBillingPeriod('annual')}
                      className={`py-2 px-3 text-xs font-semibold rounded-md transition-all duration-200 ${
                        billingPeriod === 'annual'
                          ? 'bg-white text-blue-600 shadow-md transform scale-105'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      📆 Annual
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tenant Hierarchy Visualization */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Tenant Structure</h2>
                <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
              </div>
              
              <div className="space-y-4">
                {/* MSSP Base License (Parent) */}
                <div className="relative">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg p-3 text-center shadow-md">
                    <div className="text-lg mb-1">🏢</div>
                    <div className="text-sm font-bold">MSSP Base License</div>
                    <div className="text-xs opacity-90">$15,000/year</div>
                  </div>
                  
                  {/* Connecting Line */}
                  {selectedTenants.length > 0 && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-300"></div>
                  )}
                </div>

                {/* Client Tenants (Children) */}
                {selectedTenants.length > 0 && (
                  <div className="relative">
                    {/* Horizontal connecting line for multiple tenants */}
                    {selectedTenants.length > 1 && (
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-gray-300"></div>
                    )}
                    
                    <div className={`grid gap-2 ${selectedTenants.length === 1 ? 'grid-cols-1' : selectedTenants.length === 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
                      {selectedTenants.map((tenant) => (
                        <div key={tenant.id} className="relative">
                          {/* Vertical connecting line */}
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-2 bg-gray-300"></div>
                          
                          <div className={`bg-gradient-to-r ${tenant.gradient} text-white rounded-lg p-3 text-center shadow-md mt-2`}>
                            <div className="text-sm mb-1">{tenant.icon}</div>
                            <div className="text-xs font-bold text-black bg-white/90 rounded px-2 py-1 mb-1">{tenant.clientName}</div>
                            <div className="text-xs font-semibold text-black bg-white/80 rounded px-2 py-0.5 mb-1">{tenant.name}</div>
                            <div className="text-xs font-semibold text-black bg-white/80 rounded px-2 py-0.5 mb-1">${tenant.price.toLocaleString()}/year</div>
                            <div className="text-xs font-medium text-black bg-white/70 rounded px-2 py-0.5 inline-block">
                              {tenant.identifiers} IDs
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Tenants Message */}
                {selectedTenants.length === 0 && (
                  <div className="text-center py-4">
                    <div className="text-gray-400 text-sm">
                      <div className="text-2xl mb-2">👥</div>
                      No client tenants selected
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cost Breakdown Card */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Cost Breakdown</h2>
                <div className="w-8 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mx-auto"></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 font-medium">Base License</span>
                  <span className="text-sm font-bold text-gray-800">${(billingPeriod === 'annual' ? BASE_LICENSE_COST : BASE_LICENSE_COST / 12).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 font-medium">Tenants</span>
                    {selectedTenants.length > 0 && (
                      <div className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full text-xs font-bold ml-2">
                        {selectedTenants.length}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-bold text-gray-800">${(billingPeriod === 'annual' 
                    ? selectedTenants.reduce((sum, t) => sum + t.price, 0)
                    : selectedTenants.reduce((sum, t) => sum + t.price, 0) / 12
                  ).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 font-medium">Add-ons</span>
                  <span className="text-sm font-bold text-gray-800">${(billingPeriod === 'annual'
                    ? Object.entries(addOns).reduce((sum, [id, qty]) => {
                        const addOn = addOnOptions.find(ao => ao.id === id);
                        return sum + (addOn ? addOn.price * qty : 0);
                      }, 0)
                    : Object.entries(addOns).reduce((sum, [id, qty]) => {
                        const addOn = addOnOptions.find(ao => ao.id === id);
                        return sum + (addOn ? addOn.price * qty : 0);
                      }, 0) / 12
                  ).toLocaleString()}</span>
                </div>
                <div className="pt-2 text-center">
                  <div className="text-sm font-semibold text-gray-600 mb-1">Total Cost</div>
                  <div className="text-xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                    ${calculations.displayCost.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Pricing Card */}
            <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-600 text-white rounded-xl shadow-xl p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-600/20 backdrop-blur-sm"></div>
              <div className="relative">
                <div className="text-center mb-4">
                  <div className="bg-white/20 p-2 rounded-lg inline-block mb-2">
                    <span className="text-lg">💰</span>
                  </div>
                  <h2 className="text-lg font-bold">Customer Pricing</h2>
                </div>
                
                {/* Individual Customer Pricing */}
                {selectedTenants.length > 0 && (
                  <div className="mb-6">
                    <div className="text-center mb-3">
                      <h3 className="text-sm font-semibold text-white/90">Per Customer Pricing</h3>
                      <div className="w-12 h-0.5 bg-white/40 rounded-full mx-auto mt-1"></div>
                    </div>
                    
                    <div className="space-y-2">
                      {selectedTenants.map((tenant) => {
                        const tenantPrice = tenant.price * (1 + markup / 100);
                        const displayPrice = billingPeriod === 'annual' ? tenantPrice : tenantPrice / 12;
                        
                        return (
                          <div key={tenant.id} className="bg-white/10 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <div className="text-left">
                                <div className="text-xs font-bold text-white">{tenant.clientName}</div>
                                <div className="text-xs text-white/70">{tenant.name}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-white">${displayPrice.toLocaleString()}</div>
                                <div className="text-xs text-white/70">{billingPeriod === 'annual' ? '/year' : '/month'}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* Combined Totals */}
                <div className="space-y-3">
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-semibold text-white/90">Combined Totals</h3>
                    <div className="w-12 h-0.5 bg-white/40 rounded-full mx-auto mt-1"></div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-emerald-100 text-xs font-medium mb-1">Your Total Cost</div>
                    <div className="text-lg font-bold">${calculations.displayCost.toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-blue-100 text-xs font-medium mb-1">Total Customer Revenue</div>
                    <div className="text-xl font-bold">${calculations.displayCustomerPrice.toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-purple-100 text-xs font-medium mb-1">Your Total Profit</div>
                    <div className="text-lg font-bold">${calculations.displayProfit.toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                    <div className="text-white/80 text-xs font-medium mb-2">Profit Margin</div>
                    <div className="text-2xl font-bold text-white mb-3">{calculations.profitMargin.toFixed(1)}%</div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2 transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(calculations.profitMargin, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center text-white/80 text-xs font-medium bg-white/10 rounded-md p-2">
                    {billingPeriod === 'annual' ? '📅 Annual' : '📆 Monthly'} pricing with {markup.toFixed(0)}% markup on services
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
