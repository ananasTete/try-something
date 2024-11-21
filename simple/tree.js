const columns = [
    {
        title: 'Name',
        children: [
            {
                title: 'First Name',
            },
            {
                title: 'Last Name',
                children: [
                    {
                        title: 'Nick Name',
                    },
                    {
                        title: 'Full Name',
                    }
                ]
            },
        ],
    },
    {
        title: 'Age',
    },
    {
        title: 'Address',
        children: [
            {
                title: 'Street',
            },
            {
                title: 'City',
            },
        ],
    },
    {
        title: 'Company',
    },
]

const rows = [];
function travel(columns, index = 0) {
    rows[index] = rows[index] || [];
    columns.forEach((column, columnIndex) => {
        const col = { ...column }
        if (col.children) {
            col.rowSpan = 1;
            col.colSpan = 1;
            rows[index].push(col);
            travel(col.children, index + 1)
        } else {
            col.$$columnIndex = columnIndex
            col.rowSpan = 1;
            col.colSpan = 1;
            rows[index].push(col);
        }
    });
}

// travel(columns)


function getFlattenColumns2(columns, childrenColumnName) {
    const rows = [];
    function travel(columns) {
        if (columns && columns.length > 0) {
            columns.forEach((column) => {
                if (!column[childrenColumnName]) {
                    rows.push({ ...column, key: column.key || column.dataIndex });
                } else {
                    travel(column[childrenColumnName]);
                }
            });
        }
    }
    travel(columns);

    return rows;
}

// console.log(getFlattenColumns2(columns, 'children'));

function getColumnsMaxDepth(columns, childrenColumnName) {
    let depth = 0;
    columns.forEach((column) => {
        if (column[childrenColumnName]) {
            const childrenDepth = getColumnsMaxDepth(column[childrenColumnName], childrenColumnName) + 1;
            depth = Math.max(depth, childrenDepth);
        } else {
            depth = Math.max(depth, 1);
        }
    })
    return depth;
}

console.log(100, getColumnsMaxDepth(columns, 'children'));


const flattenColumns = [];

function getFlattenColumnsHelper(columns) {
    columns.forEach((column) => {
        if (column.children) {
            getFlattenColumnsHelper(column.children)
        } else {
            flattenColumns.push(column)
        }
    })
}

// getFlattenColumnsHelper(columns)
// console.log(flattenColumns);