import React from 'react'
import { sortable } from '@patternfly/react-table'
import { DataListRowGenerator, DataListColumnGenerator, IAccountApplication } from 'types'
import { TFunction } from 'i18next'
import {
  ApplicationPageLink,
  PlanOverviewLink,
  StateLabel,
  ProductLink
} from 'components'

const generateRows: DataListRowGenerator = (applications: IAccountApplication[]) => {
  // Rows and Columns must have the same order
  const mapAccountToRowCell = (application: IAccountApplication) => [
    {
      stringValue: application.name,
      title: <ApplicationPageLink application={application} />
    },
    {
      stringValue: application.product.name,
      title: <ProductLink product={application.product} />
    },
    {
      stringValue: application.plan.name,
      title: <PlanOverviewLink plan={application.plan} />
    },
    application.created_on,
    {
      stringValue: application.state,
      title: <StateLabel state={application.state} />
    }
  ]

  return applications.map((a) => ({
    id: a.id,
    cells: mapAccountToRowCell(a),
    selected: false
  }))
}

// Filterable columns must have an id equal to its category name
const generateColumns: DataListColumnGenerator = (t: TFunction) => [
  {
    categoryName: 'name',
    title: t('applicationsIndex:applications_table.name_header'),
    transforms: [sortable]
  },
  {
    categoryName: 'product',
    title: t('applicationsIndex:applications_table.product_header'), // FIXME: add this to strings file
    transforms: [sortable]
  },
  {
    categoryName: 'plan',
    title: t('applicationsIndex:applications_table.plan_header'),
    transforms: [sortable]
  },
  {
    categoryName: 'created_on',
    title: t('applicationsIndex:applications_table.created_header'),
    transforms: [sortable]
  },
  {
    categoryName: 'state',
    title: t('applicationsIndex:applications_table.state_header'),
    transforms: [sortable]
  }
]

export { generateColumns, generateRows }
