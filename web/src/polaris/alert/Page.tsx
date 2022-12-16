import React from 'react'
import { DuckCmpProps, memorize } from 'saga-duck'
import NamespaceDuck from './PageDuck'
import getColumns from './getColumns'
import insertCSS from '../common/helpers/insertCSS'
import { Justify, Table, Button, SearchBox, Card, TabPanel, Tabs } from 'tea-component'
import GridPageGrid from '../common/duckComponents/GridPageGrid'
import GridPagePagination from '../common/duckComponents/GridPagePagination'
import BasicLayout from '../common/components/BaseLayout'
import { MonitorPanel } from '../monitor/Page'

insertCSS(
  'service',
  `
.justify-search{
  margin-right:20px
}
.justify-button{
  vertical-align: bottom
}
`,
)
const getHandlers = memorize(({ creators }: NamespaceDuck, dispatch) => ({
  inputKeyword: (keyword) => dispatch(creators.inputKeyword(keyword)),
  search: (keyword) => dispatch(creators.search(keyword)),
  clearKeyword: () => dispatch(creators.inputKeyword('')),
  reload: () => dispatch(creators.reload()),
  create: () => dispatch(creators.create()),
}))
export default function ServicePage(props: DuckCmpProps<NamespaceDuck>) {
  const { duck, store, dispatch } = props
  const { selectors, ducks } = duck
  const columns = getColumns(props)
  const handlers = getHandlers(props)
  return (
    <BasicLayout title={'业务监控'} store={store} selectors={duck.selectors} header={<></>}>
      <Tabs
        tabs={[
          { id: 'business', label: '监控曲线' },
          { id: 'alert', label: '告警配置' },
        ]}
        ceiling
      >
        <TabPanel id={'business'}>
          <MonitorPanel duck={ducks.business} store={store} dispatch={dispatch} />
        </TabPanel>
        <TabPanel id={'alert'}>
          <Table.ActionPanel>
            <Justify
              left={
                <Button type={'primary'} onClick={handlers.create}>
                  {'新建'}
                </Button>
              }
              right={
                <>
                  <SearchBox
                    value={selectors.pendingKeyword(store)}
                    placeholder={'请输入规则名称'}
                    onSearch={handlers.search}
                    onChange={handlers.inputKeyword}
                    onClear={handlers.clearKeyword}
                  />
                  <Button type={'icon'} icon={'refresh'} onClick={handlers.reload}></Button>
                </>
              }
            />
          </Table.ActionPanel>
          <Card>
            <GridPageGrid duck={duck} dispatch={dispatch} store={store} columns={columns} />
            <GridPagePagination duck={duck} dispatch={dispatch} store={store} />
          </Card>
        </TabPanel>
      </Tabs>
    </BasicLayout>
  )
}