import React, { useEffect } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  OnSort
} from '@patternfly/react-table'
import {
  PageEmptyState,
  useDataListFilters,
  useDataListPagination,
  Toolbar,
  SearchWidget,
  PaginationWidget,
  filterRows,
  DataListProvider,
  useDataListTable
} from 'components'
import { useTranslation } from 'i18n/useTranslation'
import { ToolbarContent, ToolbarItem } from '@patternfly/react-core'
import { generateColumns, generateRows } from 'components/pages/accounts/utils'
import { IDeveloperAccount } from 'types'

interface Props {
  accounts: IDeveloperAccount[]
}

const AccountsTable: React.FunctionComponent<Props> = ({ accounts }) => {
  const { t } = useTranslation('accountsIndex')
  const {
    columns,
    rows,
    sortBy,
    setSortBy
  } = useDataListTable({ columns: generateColumns(t), rows: generateRows(accounts) })

  if (rows.length === 0) {
    return <PageEmptyState msg={t('accounts_table.empty_state')} />
  }

  const { startIdx, endIdx, resetPagination } = useDataListPagination()
  const { filters } = useDataListFilters()

  const options = [
    { name: 'approved', humanName: t('actions_filter_options.by_state_options.approved') },
    { name: 'pending', humanName: t('actions_filter_options.by_state_options.pending') },
    { name: 'rejected', humanName: t('actions_filter_options.by_state_options.rejected') },
    { name: 'suspended', humanName: t('actions_filter_options.by_state_options.suspended') }
  ]

  const categories = [
    { name: 'group', humanName: t('accounts_table.group_header') },
    { name: 'admin', humanName: t('accounts_table.admin_header') },
    { name: 'state', humanName: t('accounts_table.state_header'), options }
  ]

  useEffect(() => resetPagination, [filters])

  const filteredRows = filterRows(rows, filters, columns)

  const visibleRows = filteredRows.slice(startIdx, endIdx)

  const onSort: OnSort = (_event, index, direction) => {
    setSortBy(index, direction)
  }

  const pagination = <PaginationWidget itemCount={filteredRows.length} />

  const Header = (
    <Toolbar>
      <ToolbarContent>
        <ToolbarItem>
          <SearchWidget categories={categories} />
        </ToolbarItem>
        <ToolbarItem variant="pagination">
          {pagination}
        </ToolbarItem>
      </ToolbarContent>
    </Toolbar>
  )

  return (
    <DataListProvider initialState={{ data: accounts }}>
      <Table
        aria-label={t('accounts_table.aria_label')}
        header={Header}
        cells={columns}
        rows={visibleRows}
        canSelectAll={false}
        sortBy={sortBy}
        onSort={onSort}
      >
        <TableHeader />
        <TableBody />
      </Table>
      <Toolbar>
        <ToolbarContent>
          <ToolbarItem variant="pagination">
            {pagination}
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
    </DataListProvider>
  )
}

export { AccountsTable }
