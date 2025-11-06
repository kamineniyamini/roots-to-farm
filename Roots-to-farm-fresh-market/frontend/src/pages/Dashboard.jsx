import React, { useState } from 'react'
import { FaWarehouse, FaBoxes, FaTruck, FaChartBar, FaExclamationTriangle, FaCheckCircle, FaSync, FaSearch, FaPlus, FaFileExport } from 'react-icons/fa'
import './Dashboard.css'

const WarehouseDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: 'Organic Apples', category: 'Fruits', quantity: 150, threshold: 20, status: 'in-stock', location: 'A-12' },
    { id: 2, name: 'Fresh Carrots', category: 'Vegetables', quantity: 85, threshold: 15, status: 'in-stock', location: 'B-07' },
    { id: 3, name: 'Farm Eggs', category: 'Dairy', quantity: 12, threshold: 10, status: 'low-stock', location: 'C-03' },
    { id: 4, name: 'Organic Lettuce', category: 'Vegetables', quantity: 45, threshold: 20, status: 'in-stock', location: 'B-15' },
    { id: 5, name: 'Tomato Seeds', category: 'Seeds', quantity: 8, threshold: 5, status: 'low-stock', location: 'D-22' }
  ])
  
  const [pendingShipments, setPendingShipments] = useState([
    { id: 'SH-001', destination: 'Downtown Market', items: 15, status: 'packing', priority: 'high' },
    { id: 'SH-002', destination: 'City Grocers', items: 8, status: 'ready', priority: 'medium' },
    { id: 'SH-003', destination: 'Farmers Market', items: 22, status: 'packing', priority: 'high' },
    { id: 'SH-004', destination: 'Local Restaurant', items: 5, status: 'dispatched', priority: 'low' }
  ])

  const [shipmentFilter, setShipmentFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  const warehouseStats = [
    { icon: <FaBoxes />, label: 'Total Inventory', value: '1,247', change: '+5%', color: 'blue' },
    { icon: <FaTruck />, label: 'Pending Shipments', value: '23', change: '-2%', color: 'orange' },
    { icon: <FaCheckCircle />, label: 'Processed Today', value: '156', change: '+12%', color: 'green' },
    { icon: <FaExclamationTriangle />, label: 'Low Stock Items', value: inventoryItems.filter(item => item.status === 'low-stock').length.toString(), change: '+3%', color: 'red' }
  ]

  // Filter inventory based on search
  const filteredInventory = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Filter shipments based on selected filters
  const filteredShipments = pendingShipments.filter(shipment => {
    const statusMatch = shipmentFilter === 'all' || shipment.status === shipmentFilter
    const priorityMatch = priorityFilter === 'all' || shipment.priority === priorityFilter
    return statusMatch && priorityMatch
  })

  // Button handlers
  const handleNewShipment = () => {
    const newShipmentId = `SH-${String(pendingShipments.length + 1).padStart(3, '0')}`
    const newShipment = {
      id: newShipmentId,
      destination: 'New Destination',
      items: 0,
      status: 'packing',
      priority: 'medium'
    }
    setPendingShipments([...pendingShipments, newShipment])
    alert(`New shipment ${newShipmentId} created!`)
  }

  const handleGenerateReport = () => {
    const reportData = {
      totalItems: inventoryItems.length,
      lowStockItems: inventoryItems.filter(item => item.status === 'low-stock').length,
      totalShipments: pendingShipments.length,
      pendingShipments: pendingShipments.filter(shipment => shipment.status !== 'dispatched').length
    }
    
    console.log('Generated Report:', reportData)
    alert('Report generated! Check console for details.')
  }

  const handleAddItem = () => {
    const newItem = {
      id: inventoryItems.length + 1,
      name: 'New Product',
      category: 'General',
      quantity: 0,
      threshold: 10,
      status: 'low-stock',
      location: 'A-01'
    }
    setInventoryItems([...inventoryItems, newItem])
    alert('New item added to inventory!')
  }

  const handleRestock = (itemId) => {
    setInventoryItems(inventoryItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: item.quantity + 50, status: item.quantity + 50 > item.threshold ? 'in-stock' : 'low-stock' }
        : item
    ))
    alert(`Item restocked!`)
  }

  const handleMoveItem = (itemId) => {
    const newLocation = prompt('Enter new location (e.g., A-15):')
    if (newLocation) {
      setInventoryItems(inventoryItems.map(item => 
        item.id === itemId ? { ...item, location: newLocation } : item
      ))
      alert(`Item moved to ${newLocation}`)
    }
  }

  const handleMarkReady = (shipmentId) => {
    setPendingShipments(pendingShipments.map(shipment =>
      shipment.id === shipmentId ? { ...shipment, status: 'ready' } : shipment
    ))
    alert(`Shipment ${shipmentId} marked as ready!`)
  }

  const handleDispatch = (shipmentId) => {
    setPendingShipments(pendingShipments.map(shipment =>
      shipment.id === shipmentId ? { ...shipment, status: 'dispatched' } : shipment
    ))
    alert(`Shipment ${shipmentId} dispatched!`)
  }

  const handleViewDetails = (shipmentId) => {
    const shipment = pendingShipments.find(s => s.id === shipmentId)
    alert(`Shipment Details:\nID: ${shipment.id}\nDestination: ${shipment.destination}\nItems: ${shipment.items}\nStatus: ${shipment.status}\nPriority: ${shipment.priority}`)
  }

  return (
    <div className="warehouse-dashboard">
      <div className="warehouse-header">
        <div className="container">
          <div className="header-content">
            <div className="header-title">
              <FaWarehouse className="header-icon" />
              <div>
                <h1>Warehouse Dashboard</h1>
                <p>Main Warehouse - Agriculture City</p>
              </div>
            </div>
            <div className="header-actions">
              <button className="btn btn-primary" onClick={handleNewShipment}>
                <FaTruck style={{marginRight: '8px'}} />
                New Shipment
              </button>
              <button className="btn btn-secondary" onClick={handleGenerateReport}>
                <FaFileExport style={{marginRight: '8px'}} />
                Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="warehouse-content">
        <div className="container">
          <div className="dashboard-nav">
            <button 
              className={`nav-btn ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <FaChartBar />
              Overview
            </button>
            <button 
              className={`nav-btn ${activeSection === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveSection('inventory')}
            >
              <FaBoxes />
              Inventory
            </button>
            <button 
              className={`nav-btn ${activeSection === 'shipments' ? 'active' : ''}`}
              onClick={() => setActiveSection('shipments')}
            >
              <FaTruck />
              Shipments
            </button>
          </div>

          {activeSection === 'overview' && (
            <div className="overview-section">
              <div className="stats-grid">
                {warehouseStats.map((stat, index) => (
                  <div key={index} className={`stat-card ${stat.color}`}>
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-content">
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                      <div className="stat-change">{stat.change}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="overview-grid">
                <div className="inventory-alerts card">
                  <h3>Inventory Alerts</h3>
                  <div className="alerts-list">
                    {inventoryItems.filter(item => item.status === 'low-stock').map(item => (
                      <div key={item.id} className="alert-item">
                        <FaExclamationTriangle className="alert-icon" />
                        <div className="alert-info">
                          <div className="alert-title">{item.name}</div>
                          <div className="alert-desc">
                            Only {item.quantity} units left (Threshold: {item.threshold})
                          </div>
                        </div>
                        <span className="alert-location">{item.location}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="recent-activity card">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <FaSync className="activity-icon" />
                      <div className="activity-content">
                        <p>Inventory count updated for Organic Apples</p>
                        <span className="activity-time">10 minutes ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <FaTruck className="activity-icon" />
                      <div className="activity-content">
                        <p>Shipment SH-004 dispatched to Local Restaurant</p>
                        <span className="activity-time">1 hour ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <FaCheckCircle className="activity-icon" />
                      <div className="activity-content">
                        <p>New stock received for Fresh Carrots</p>
                        <span className="activity-time">2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'inventory' && (
            <div className="inventory-section">
              <div className="section-header">
                <h2>Inventory Management</h2>
                <div className="header-controls">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary" onClick={handleAddItem}>
                    <FaPlus style={{marginRight: '8px'}} />
                    Add Item
                  </button>
                </div>
              </div>

              <div className="inventory-table card">
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Quantity</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map(item => (
                      <tr key={item.id}>
                        <td className="product-name">{item.name}</td>
                        <td>{item.category}</td>
                        <td>
                          <span className={`quantity ${item.status}`}>
                            {item.quantity}
                            {item.status === 'low-stock' && <FaExclamationTriangle />}
                          </span>
                        </td>
                        <td>
                          <span className={`status ${item.status}`}>
                            {item.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="location">{item.location}</td>
                        <td className="actions">
                          <button 
                            className="btn btn-sm" 
                            onClick={() => handleRestock(item.id)}
                          >
                            Restock
                          </button>
                          <button 
                            className="btn btn-sm btn-secondary" 
                            onClick={() => handleMoveItem(item.id)}
                          >
                            Move
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'shipments' && (
            <div className="shipments-section">
              <div className="section-header">
                <h2>Shipment Management</h2>
                <div className="shipment-filters">
                  <select value={shipmentFilter} onChange={(e) => setShipmentFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="packing">Packing</option>
                    <option value="ready">Ready</option>
                    <option value="dispatched">Dispatched</option>
                  </select>
                  <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="shipments-grid">
                {filteredShipments.map(shipment => (
                  <div key={shipment.id} className="shipment-card card">
                    <div className="shipment-header">
                      <div className="shipment-id">{shipment.id}</div>
                      <span className={`priority ${shipment.priority}`}>
                        {shipment.priority}
                      </span>
                    </div>
                    <div className="shipment-destination">
                      <FaTruck />
                      <span>{shipment.destination}</span>
                    </div>
                    <div className="shipment-details">
                      <div className="detail">
                        <span className="label">Items:</span>
                        <span className="value">{shipment.items}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Status:</span>
                        <span className={`status ${shipment.status}`}>
                          {shipment.status}
                        </span>
                      </div>
                    </div>
                    <div className="shipment-actions">
                      <button 
                        className="btn btn-sm" 
                        onClick={() => handleViewDetails(shipment.id)}
                      >
                        View Details
                      </button>
                      {shipment.status === 'packing' && (
                        <button 
                          className="btn btn-sm btn-primary" 
                          onClick={() => handleMarkReady(shipment.id)}
                        >
                          Mark Ready
                        </button>
                      )}
                      {shipment.status === 'ready' && (
                        <button 
                          className="btn btn-sm btn-accent" 
                          onClick={() => handleDispatch(shipment.id)}
                        >
                          Dispatch
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WarehouseDashboard