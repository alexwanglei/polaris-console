import React, { useState } from 'react'
import { DuckCmpProps, purify } from 'saga-duck'
import Duck from './CreateDuck'
import { Button, Form, FormItem, Icon, Select } from 'tea-component'
import Dialog from '@src/polaris/common/duckComponents/Dialog'
import FormField from '@src/polaris/common/duckComponents/form/Field'
import Input from '@src/polaris/common/duckComponents/form/Input'
import ResourcePrincipalAuth from '@src/polaris/auth/user/operation/ResourcePrincipalAuth'

export default function Create(props: DuckCmpProps<Duck>) {
  const { duck, store, dispatch } = props
  const { selectors } = duck
  const visible = selectors.visible(store)
  if (!visible) {
    return <noscript />
  }
  const data = selectors.data(store)
  return (
    <Dialog
      duck={duck}
      store={store}
      dispatch={dispatch}
      size={'l'}
      title={data.name ? '编辑配置文件组' : '新建配置文件组'}
    >
      <CreateForm duck={duck} store={store} dispatch={dispatch} />
    </Dialog>
  )
}

const CreateForm = purify(function CreateForm(props: DuckCmpProps<Duck>) {
  const { duck, store, dispatch } = props
  const {
    ducks: { form, userSelect, userGroupSelect },
    selectors,
  } = duck
  const [showAdvance, setShowAdvance] = useState(false)
  const formApi = form.getAPI(store, dispatch)
  const { namespace, comment, name } = formApi.getFields(['namespace', 'name', 'comment'])
  const options = selectors.options(store)

  return (
    <>
      <Form>
        <FormField field={namespace} label={'命名空间'} required>
          <Select
            value={namespace.getValue()}
            options={options.namespaceList}
            onChange={value => namespace.setValue(value)}
            type={'simulate'}
            appearance={'button'}
            size='l'
            disabled={options.isModify}
          ></Select>
        </FormField>
        <FormField field={name} label={'分组名'}>
          <Input
            field={name}
            maxLength={128}
            placeholder={'允许数字、英文字母、.、-、_，限制128个字符'}
            size={'l'}
            disabled={options?.isModify}
          />
        </FormField>
        <FormField field={comment} label={'描述'}>
          <Input field={comment} maxLength={1024} placeholder={'长度不超过1024个字符'} size={'l'} />
        </FormField>
        <Button type='link' onClick={() => setShowAdvance(!showAdvance)} style={{ cursor: 'pointer' }}>
          <Icon type={showAdvance ? 'arrowup' : 'arrowdown'} />
          高级配置
        </Button>
        {showAdvance && (
          <FormItem label='授权'>
            <ResourcePrincipalAuth
              userDuck={userSelect}
              userGroupDuck={userGroupSelect}
              duck={duck}
              store={store}
              dispatch={dispatch}
            />
          </FormItem>
        )}
      </Form>
    </>
  )
})
