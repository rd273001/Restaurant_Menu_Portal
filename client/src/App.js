import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useTable, useSortBy } from "react-table";
import "./App.css";

const App = () => {
  const [menuItems, setMenuItems] = useState( [] );
  const [editingItemId, setEditingItemId] = useState( null );

  useEffect( () => {
    // Fetch menu items from the backend API when the DOM mounts
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get( "/api/menu" );
        setMenuItems( response.data );
        console.log( "Response Data:", response.data );
      } catch ( error ) {
        console.error( "Error fetching menu items:", error );
      }
    };
    fetchMenuItems();
  }, [editingItemId] );

  const handlePriceChange = async ( id, price ) => {
    // Check if the price parameter is a number.
    const numberPrice = Number( price );
    // If the price parameter is not a number, show an alert and return.
    if ( !numberPrice ) {
      // `alert` is a built-in JavaScript function that displays an alert box.
      alert( "Price must be a number" );
      return;
    }
    // This function gets the price of a menu item by its id.
    const getPriceById = async ( id ) => {
      const response = await axios.get( `/api/menu/${ id }` );
      return response.data.price;
    };
    // Check if the price is the same as before.
    const oldPrice = await getPriceById( id );
    if ( price === oldPrice ) {
      alert( "Price is the same as before." );
      return;
    }
    try {
      await axios.put( `/api/menu/${ id }`, { price } );
      alert( `Price updated for item with ID => ${ id }` );
      setEditingItemId( null );
    } catch ( error ) {
      console.error( `Error updating price for item ${ id }:`, error );
    }
  };

  const columns = useMemo(
    () => {
      const PriceCell = ( { row, value } ) => {
        const isEditing = row.original.id === editingItemId;

        const [inputValue, setInputValue] = useState( value );

        const handleChange = ( e ) => {
          setInputValue( e.target.value );
        };

        const handleSave = () => {
          handlePriceChange( row.original.id, inputValue );
        };

        const handleEdit = () => {
          setEditingItemId( row.original.id );
        };

        return (
          <div className="price-cell">
            { isEditing ? (
              <input
                className="input-price"
                type="text"
                value={ inputValue }
                onChange={ handleChange }
              />
            ) : (
              <div className="price-value">{ value }</div>
            ) }
            { isEditing ? (
              <button
                className="save-button"
                onClick={ handleSave }
              >
                Save
              </button>
            ) : (
              <button
                className="edit-button"
                onClick={ handleEdit }
              >
                Edit
              </button>
            ) }
          </div>
        );
      };

      return [
        {
          Header: "ID",
          accessor: "id",
        },
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Image",
          accessor: "image",
          Cell: ( { value } ) => (
            <img src={ value } alt="Item" style={ { width: "50px" } } />
          ),
        },
        {
          Header: "Category",
          accessor: "category",
          Aggregated: () => "All Categories",
        },
        {
          Header: "Label",
          accessor: "label",
        },
        {
          Header: "Price",
          accessor: "price",
          Cell: PriceCell,
        },
        {
          Header: "Description",
          accessor: "description",
        },
      ];
    },
    [editingItemId] // Add editingItemId as a dependency for useMemo
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: menuItems,
      },
      useSortBy
    );

  return (
    <div className="container">
      <p className="tableTitle">Menu Items</p>
      <table { ...getTableProps() } className="table">
        <thead>
          { headerGroups.map( ( headerGroup ) => (
            <tr { ...headerGroup.getHeaderGroupProps() }>
              { headerGroup.headers.map( ( column ) => (
                <th
                  { ...column.getHeaderProps(
                    column.getSortByToggleProps()
                  ) }
                  style={ { padding: "8px" } }
                >
                  { column.render( "Header" ) }
                  <span>
                    { column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : "" }
                  </span>
                </th>
              ) ) }
            </tr>
          ) ) }
        </thead>
        <tbody { ...getTableBodyProps() }>
          { rows.map( ( row ) => {
            prepareRow( row );
            return (
              <tr
                { ...row.getRowProps() }
                style={ { borderBottom: "1px solid #ccc" } }
              >
                { row.cells.map( ( cell ) => (
                  <td
                    { ...cell.getCellProps() }
                    style={ { padding: "8px" } }
                  >
                    { cell.render( "Cell" ) }
                  </td>
                ) ) }
              </tr>
            );
          } ) }
        </tbody>
      </table>
    </div>
  );
};

export default App;