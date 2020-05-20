import React, { useState } from 'react'
import {
  Dropdown,
  DropdownToggle,
  DropdownToggleCheckbox,
  DropdownItem
} from '@patternfly/react-core'
import { useTranslation } from 'i18n/useTranslation'
import { useDataListTable, useDataListPagination } from 'components/data-list'

interface Props {
  // TODO: try make it independent from table data
  filteredRows: { id: number }[]
}

const BulkSelectorWidget: React.FunctionComponent<Props> = ({
  filteredRows
}) => {
  const { t } = useTranslation('shared')
  const { selectPage, selectAll, selectedRows } = useDataListTable()
  const { startIdx, endIdx } = useDataListPagination()

  const [isOpen, setIsOpen] = useState(false)

  const selectedCount = selectedRows.length
  const visibleRows = filteredRows.slice(startIdx, endIdx)
  const pageCount = visibleRows.length
  const allCount = filteredRows.length

  const onSelect = () => setIsOpen((current) => !current)

  // FIXME: Setting isChecked null creates an error in the console for uncontrolled React prop
  // eslint-disable-next-line no-nested-ternary
  const isChecked = (selectedCount === 0) ? false
    : (selectedCount === allCount) ? true
    // For the indeterminate state, PF React needs to be passed null
      : null

  const dropdownItems = [
    <DropdownItem key="0" onClick={() => selectAll(false)}>
      {t('bulk_selector.none')}
    </DropdownItem>,
    <DropdownItem key="1" onClick={() => selectPage(visibleRows)}>
      {t('bulk_selector.page', { count: pageCount })}
    </DropdownItem>,
    <DropdownItem key="2" onClick={() => selectAll(true, filteredRows)}>
      {t('bulk_selector.all', { count: allCount })}
    </DropdownItem>
  ]

  return (
    <Dropdown
      isOpen={isOpen}
      dropdownItems={dropdownItems}
      onSelect={onSelect}
      toggle={(
        <DropdownToggle
          onToggle={setIsOpen}
          splitButtonItems={[
            <DropdownToggleCheckbox
              key="developer-accounts-bulk-checkbox"
              id="developer-accounts-bulk-checkbox"
              isChecked={isChecked}
              onClick={() => selectAll(selectedCount === 0, filteredRows)}
              aria-label={t('bulk_selector.toggle_checkbox_aria_label')}
            />
          ]}
        >
          {selectedCount > 0 ? t('bulk_selector.label', { selectedCount }) : ''}
        </DropdownToggle>
      )}
    />
  )
}

export { BulkSelectorWidget }