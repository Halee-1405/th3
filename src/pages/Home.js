import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteItem,
  addItem,
  editItem,
  setSearchQuery,
  setCurrentPage,
} from '../features/itemsSlice';

function Home() {
  const { items, searchQuery, currentPage, itemsPerPage } = useSelector(
    (state) => state.items
  );
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', price: '', category: '' });
  const [editItemData, setEditItemData] = useState({});
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedItems = useMemo(() => {
    let sortedArray = [...items];
    if (sortConfig.key === 'name') {
      sortedArray.sort((a, b) => {
        return sortConfig.direction === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });
    } else if (sortConfig.key === 'price') {
      sortedArray.sort((a, b) => {
        return sortConfig.direction === 'asc' ? a.price - b.price : b.price - a.price;
      });
    }
    return sortedArray;
  }, [items, sortConfig]);

  const filteredItems = useMemo(() => {
    return sortedItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedItems, searchQuery]);

  const paginatedItems = useMemo(() => {
    return filteredItems.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredItems, currentPage, itemsPerPage]);

  const totalPrice = useMemo(() => {
    return filteredItems.reduce((total, item) => total + parseFloat(item.price || 0), 0);
  }, [filteredItems]);
  
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handleAddItem = () => {
    dispatch(addItem(newItem));
    setNewItem({ name: '', price: '', category: '' });
    setModalOpen(false);
  };

  const handleEditItem = () => {
    dispatch(
      editItem({
        index: items.indexOf(editItemData),
        updatedItem: editItemData,
      })
    );
    setEditModalOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === "modal") {
      setModalOpen(false);
      setEditModalOpen(false);
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h3>Hướng dẫn</h3>
        <button className="sidebar-btn">Quản lý hàng hóa</button>
      </div>

      <div className='content'>
        <h2>Bảng Thông Tin</h2>
        <button className="add-item-btn" onClick={() => setModalOpen(true)}>Thêm Hàng Hóa</button>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />

        <table>
          <thead>
            <tr style={{backgroundColor:'#f2f2f2'}} >
              <th onClick={() => handleSort('name')} style={{cursor: 'pointer'}}>
                Tên {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('price')} style={{cursor: 'pointer'}}>
                Giá {sortConfig.key === 'price' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditItemData(item);
                      setEditModalOpen(true);
                    }}
                  >
                    Chỉnh sửa
                  </button>
                  <button 
                    className="delete-btn" 
                    title="Bạn sẽ không thể khôi phục lại dữ liệu sau khi xóa"
                    onClick={() => dispatch(deleteItem(items.indexOf(item)))}
                    >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          {currentPage === totalPages && (
            <tr>
              <td style={{ fontWeight: 'bold' }}>Tổng</td>
              <td style={{ fontWeight: 'bold' }}>{totalPrice}</td>
              <td></td>
            </tr>
          )}
          </tbody>
        </table>

        <div className="pagination">
          <button
            disabled={filteredItems.length <= 5 || currentPage === 1}
            onClick={() =>
              dispatch(setCurrentPage(Math.max(currentPage - 1, 1)))
            }
          >
            Trước
          </button>
          <span>
            Trang {currentPage}/{Math.ceil(filteredItems.length / itemsPerPage)}
          </span>
          <button
            disabled={
              filteredItems.length <= 5 ||
              currentPage === Math.ceil(filteredItems.length / itemsPerPage)
            }
            onClick={() =>
              dispatch(
                setCurrentPage(
                  Math.min(
                    currentPage + 1,
                    Math.ceil(filteredItems.length / itemsPerPage)
                  )
                )
              )
            }
          >
            Sau
          </button>
        </div>

        {modalOpen && (
          <div className="modal" onClick={handleOutsideClick}>
            <div className="modal-content">
              <button className="close-icon" onClick={() => setModalOpen(false)}>&times;</button>
              <h3>Thêm Hàng Hóa</h3>
              <input
                type="text"
                placeholder="Tên hàng hóa"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
              <input
                type="number"
                placeholder="Giá hàng hóa"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
              <select
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
              >
                <option value="">Chọn danh mục</option>
                <option value="Văn phòng phẩm">Văn phòng phẩm</option>
                <option value="Quần áo">Quần áo</option>
                <option value="Đồ dùng khác">Đồ dùng khác</option>
              </select>
              <button className='add-btn' onClick={handleAddItem}>Thêm Hàng Hóa</button>
              <button className='close-btn' onClick={() => setModalOpen(false)}>Đóng</button>
            </div>
          </div>
        )}

        {editModalOpen && (
          <div className="modal" onClick={handleOutsideClick}>
            <div className="modal-content">
              <button className="close-icon" onClick={() => setEditModalOpen(false)}>&times;</button>
              <h3>Chỉnh Sửa Hàng Hóa</h3>
              <input
                type="text"
                value={editItemData.name}
                onChange={(e) =>
                  setEditItemData({ ...editItemData, name: e.target.value })
                }
              />
              <input
                type="number"
                value={editItemData.price}
                onChange={(e) =>
                  setEditItemData({ ...editItemData, price: e.target.value })
                }
              />
              <select
                value={editItemData.category}
                onChange={(e) =>
                  setEditItemData({ ...editItemData, category: e.target.value })
                }
              >
                <option value="">Chọn danh mục</option>
                <option value="Văn phòng phẩm">Văn phòng phẩm</option>
                <option value="Quần áo">Quần áo</option>
                <option value="Đồ dùng khác">Đồ dùng khác</option>
              </select>
              <button className='add-btn' onClick={handleEditItem}>Lưu Thay Đổi</button>
              <button className='close-btn' onClick={() => setEditModalOpen(false)}>Đóng</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;



