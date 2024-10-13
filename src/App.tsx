import { Suspense } from 'react'

import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'

import { routeConfig } from '@config/routeConfig'

import { SocketContextProvider } from '@context/socket/context'

import Loading from '@components/common/Loading'
// import { useForm } from 'react-hook-form'
import { Button, TextField } from '@components/common/form'
import CheckboxGroup from '@components/common/form/checkboxGroup'
import Dropdown from '@components/common/form/dropdown'
import MultiSelectDropdown from '@components/common/form/multiSelectDropdown'

function App() {
  // const {
  //   control,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm({
  //   defaultValues: {
  //     user: 'sdfdsf',
  //     checkboxGroup: ['value 1'],
  //   },
  // })

  return (
    <Router>
      <SocketContextProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            {routeConfig.map((route, index) => {
              const { path, element: Component, guard: Guard, children } = route
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    Guard ? (
                      <Guard>
                        <Component />
                      </Guard>
                    ) : (
                      <Component />
                    )
                  }
                >
                  {children?.map((childRoute, childIndex) => (
                    <Route
                      key={childIndex}
                      path={childRoute.path}
                      element={<childRoute.element />}
                    />
                  ))}
                </Route>
              )
            })}
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </Suspense>
      </SocketContextProvider>
    </Router>
    // <div className="p-5">
    //   <h1 className="text-3xl font-bold underline">Welcome to Krish</h1>
    //   <form
    //     onSubmit={handleSubmit((data) => {
    //       console.log(data)
    //     })}
    //   >
    //     <TextField
    //       name="user"
    //       control={control}
    //       error={errors.user?.message?.toString()}
    //       label="User Name"
    //     />

    //     <Button label="Submit" />

    //     <CheckboxGroup
    //       columns={1}
    //       control={control}
    //       name="checkboxGroup"
    //       options={[
    //         {
    //           label: 'label 1',
    //           value: 'value 1',
    //         },
    //         {
    //           label: 'label 2',
    //           value: 'value 2',
    //         },
    //         {
    //           label: 'label 3',
    //           value: 'value 3',
    //         },
    //       ]}
    //     />
    //   </form>
    // </div>
  )
}

export default App
