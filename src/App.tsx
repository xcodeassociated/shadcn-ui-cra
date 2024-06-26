import React, { ComponentProps, FC, useEffect, useState } from 'react'
import { ModeToggle } from '@/components/mode-toggle'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { cn } from '@/lib/utils'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  ArrowUpDown,
  Languages,
  LogOut,
  Menu,
  MessageSquare,
  MoreHorizontal,
  Search,
  Settings,
  User,
  UserCircle,
  UserPlus,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTranslation } from 'react-i18next'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { useLocation, useNavigate } from 'react-router'
import { Label } from '@/components/ui/label'

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { OnChangeFn } from '@tanstack/table-core/src/types'

import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { Table as TTable } from '@tanstack/react-table'

export interface Role {
  readonly _id: string | undefined
  name: string
  description: string

  version: number | undefined
  createdBy: string | undefined
  createdDate: string | undefined
  modifiedBy: string | undefined
  modifiedDate: string | undefined
}

export interface User {
  readonly _id: string | undefined
  name: string
  email: string
  role: Role[]

  version: number | undefined
  createdBy: string | undefined
  createdDate: string | undefined
  modifiedBy: string | undefined
  modifiedDate: string | undefined
}

export class Page {
  page: number
  pageSize: number
  sort: string
  direction: string

  constructor(page: number = 0, pageSize: number = 10, sort: string = 'id', direction: string = 'ASC') {
    this.page = page
    this.pageSize = pageSize
    this.sort = sort
    this.direction = direction
  }
}

interface UserInput {
  _id: string | undefined
  name: string
  email: string
  role: string[]
  version: number | undefined
}

const parse = (data: User): UserInput => {
  return {
    _id: data._id,
    name: data.name,
    email: data.email,
    role: data.role.filter((e) => e !== undefined).map((e) => e._id!!),
    version: data.version,
  }
}

type MenuItem = {
  readonly key: string
  readonly route: string
  readonly restricted: boolean
}

const menuItems: MenuItem[] = [
  {
    key: 'Home',
    route: '/',
    restricted: false,
  },
  {
    key: 'About',
    route: '/about',
    restricted: false,
  },
  {
    key: 'Counter',
    route: '/counter',
    restricted: true,
  },
  {
    key: 'Users',
    route: '/users',
    restricted: true,
  },
]

const NavMenuItem = ({ item }: { item: MenuItem }) => {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        className={navigationMenuTriggerStyle() + ' cursor-pointer'}
        active={location.pathname === item.route}
        onClick={() => navigate(item.route)}
      >
        {item.key}
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}

const SideMenuItem = ({ item }: { item: MenuItem }) => {
  const navigate = useNavigate()
  const location = useLocation()
  return (
    <SheetClose asChild>
      <Label
        className={
          (location.pathname === item.route ? 'text-xl' : 'text-xl text-muted-foreground') +
          ' cursor-pointer rounded border bg-muted p-2 hover:text-foreground'
        }
        onClick={() => navigate(item.route)}
      >
        {item.key}
      </Label>
    </SheetClose>
  )
}

const CodeText = (props: ComponentProps<'span'>) => {
  return (
    <span {...props} className={cn(props.className, 'rounded bg-muted p-1 font-mono text-sm text-muted-foreground')} />
  )
}

const roles: Role[] = [
  {
    _id: '1',
    name: 'Admin',
    description: 'Admin Role',
    version: 1,
    createdBy: 'Admin',
    createdDate: '2021-10-01',
    modifiedBy: 'Admin',
    modifiedDate: '2021-10-01',
  },
  {
    _id: '2',
    name: 'User',
    description: 'User Role',
    version: 1,
    createdBy: 'Admin',
    createdDate: '2021-10-01',
    modifiedBy: 'Admin',
    modifiedDate: '2021-10-01',
  },
]

const users: User[] = [
  {
    _id: '1',
    name: 'Admin',
    email: 'admin@admin',
    role: [roles[0]],
    version: 1,
    createdBy: 'Admin',
    createdDate: '2021-10-01',
    modifiedBy: 'Admin',
    modifiedDate: '2021-10-01',
  },
  {
    _id: '2',
    name: 'User',
    email: 'user@user',
    role: [roles[1]],
    version: 1,
    createdBy: 'Admin',
    createdDate: '2021-10-01',
    modifiedBy: 'Admin',
    modifiedDate: '2021-10-01',
  },
]

const getUsers = async (page: Page): Promise<User[]> => {
  console.log(`Get users: ${JSON.stringify(page)}`)
  return users
}

const getUsersSize = async (): Promise<number> => users.length

const createUser = async (data: UserInput): Promise<User> => {
  console.log(`Create user: ${JSON.stringify(data)}`)
  return {
    _id: data._id,
    name: data.name,
    email: data.email,
    role: roles.filter((e) => data.role.includes(e._id!!)),
    version: data.version,
    createdBy: 'XXX',
    createdDate: '2021-10-01',
    modifiedBy: 'XXX',
    modifiedDate: '2021-10-01',
  }
}

const updateUser = async (data: UserInput): Promise<User> => {
  console.log(`Update user: ${JSON.stringify(data)}`)
  return {
    _id: data._id,
    name: data.name,
    email: data.email,
    role: roles.filter((e) => data.role.includes(e._id!!)),
    version: data.version,
    createdBy: 'XXX',
    createdDate: '2021-10-01',
    modifiedBy: 'XXX',
    modifiedDate: '2021-10-01',
  }
}

const deleteUser = async (user: User): Promise<void> => {
  console.log(`Delete user: ${user._id}`)
}

const formSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  role: z.string().length(1, {
    message: 'You must select role.',
  }),
  version: z.number().optional(),
})

interface UserDialogProps {
  children?: React.ReactNode
  data?: UserInput
  submit?: (data: UserInput) => void
}

const UserDialog = ({ children, data, submit }: UserDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: undefined,
      name: '',
      email: '',
      role: '',
      version: undefined,
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (submit) {
      submit({
        _id: values._id,
        name: values.name,
        email: values.email,
        role: [values.role],
        version: values.version,
      })
    }
    form.reset()
    setIsOpen(false)
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(nextState) => {
          setIsOpen(nextState)
          if (!nextState) {
            form.reset()
          } else {
            if (data !== undefined) {
              form.setValue('_id', data._id)
              form.setValue('name', data.name)
              form.setValue('email', data.email)
              form.setValue('role', data.role[0])
            }
          }
        }}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{form.getValues()._id === undefined ? 'Add user' : 'Update user'}</DialogTitle>
            <DialogDescription>Some description goes here.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-4">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormDescription>Some text goes here.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-4">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="col-span-4">
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {roles.map((role) => (
                                  <SelectItem key={role._id} value={role._id?.toString() ? role._id?.toString() : ''}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: '_id',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: () => <div className="font-bold">Role</div>,
    cell: ({ row }) => {
      const formatted = row.original.role.map((role) => role.name).join(', ')
      return <div className="">{formatted}</div>
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex">
          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <UserDialog
                  data={parse(user)}
                  submit={(data) => {
                    updateUser(data).then((user) => {})
                  }}
                >
                  <Label className="group m-0 inline-flex w-full rounded-md bg-background px-2 py-2 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none">
                    Update
                  </Label>
                </UserDialog>
                <Label
                  className="group m-0 inline-flex w-full rounded-md bg-background px-2 py-2 text-sm font-normal transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                  onClick={() => deleteUser(user)}
                >
                  Delete
                </Label>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )
    },
  },
]

interface DataTablePaginationProps<TData> {
  table: TTable<TData>
  withSelected?: boolean
}

export function DataTablePagination<TData>({ table, withSelected }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {withSelected ? (
          <>
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <DoubleArrowLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <DoubleArrowRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  total: number
  pagination: PaginationState
  paginationChangeFn: OnChangeFn<PaginationState>
  sorting?: SortingState
  sortingChangeFn?: OnChangeFn<SortingState>
}

export const DataTable = <TData, TValue>({
  columns,
  data,
  total,
  pagination,
  paginationChangeFn,
  sorting,
  sortingChangeFn,
}: DataTableProps<TData, TValue>) => {
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: paginationChangeFn,
    rowCount: total,
    state: {
      pagination,
      sorting,
    },
    manualPagination: true,
    debugTable: false,
    onSortingChange: sortingChangeFn,
    manualSorting: true,
  })

  return (
    <div>
      <div className="flex flex-col">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="py-2">
          <DataTablePagination table={table} withSelected={false} />
        </div>
      </div>
    </div>
  )
}

const buildPage = (pagination: PaginationState, sorting: SortingState): Page => {
  return new Page(pagination.pageIndex, pagination.pageSize, sorting[0].id, sorting[0].desc ? 'DESC' : 'ASC')
}

const Users = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 1,
  })
  const [sorting, setSorting] = React.useState<SortingState>([{ id: '_id', desc: false }])

  const [users, setUsers] = useState<User[]>([])
  const [usersSize, setUsersSize] = useState(0)

  useEffect(() => {
    getUsersSize()
      .then((data) => setUsersSize(data))
      .catch((e) => console.error(e))

    getUsers(buildPage(pagination, sorting))
      .then((data) => {
        console.log(`Pagination or sorting changed: ${JSON.stringify(pagination)}`)
        console.log(`Sorting: ${JSON.stringify(sorting)}`)
        setUsers(data)
      })
      .catch((e) => console.error(e))
  }, [pagination, sorting])

  return (
    <div>
      <div className="flex flex-col">
        <>
          <UserDialog
            data={undefined}
            submit={(data) => {
              createUser(data).then((user) => {})
            }}
          >
            <Button variant="outline" className="my-4 ml-auto flex-1">
              Add user
            </Button>
          </UserDialog>
        </>
        <>
          <DataTable
            columns={columns}
            data={users}
            total={usersSize}
            pagination={pagination}
            paginationChangeFn={setPagination}
            sorting={sorting}
            sortingChangeFn={setSorting}
          />
        </>
      </div>
    </div>
  )
}

const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  console.log(`search: ${e.currentTarget.search.value}`)
  e.currentTarget.reset()
}

const handleUserDropdownSelect = (item: string) => {
  console.log(`User dropdown change: ${item}`)
}

export function App() {
  const [count, setCount] = useState(0)
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [authenticated, setAuthenticated] = useState(true)
  const { t } = useTranslation(['main'])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Label
            className="flex cursor-pointer items-center gap-2 text-lg font-semibold md:text-base"
            onClick={() => navigate('/')}
          >
            Shadcn
          </Label>
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems
                .filter((item) => (item.restricted ? authenticated : true))
                .map((item) => (
                  <NavMenuItem key={item.key} item={item} />
                ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-3 text-lg font-normal">
              <SheetTitle className="flex items-center gap-2 text-3xl font-semibold">Shadcn</SheetTitle>
              <SheetDescription>
                <span className="sr-only">Navigation menu</span>
              </SheetDescription>
              {menuItems
                .filter((item) => (item.restricted ? authenticated : true))
                .map((item) => (
                  <SideMenuItem key={item.key} item={item} />
                ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial" onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="Search..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <div>
            <ModeToggle />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            {authenticated ? (
              <>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => handleUserDropdownSelect('profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleUserDropdownSelect('settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Languages className="mr-2 h-4 w-4" />
                      <span>Select Language</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem onSelect={() => handleUserDropdownSelect('lang/english')}>
                          <span>English</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleUserDropdownSelect('lang/polish')}>
                          <span>Polski</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => {
                      handleUserDropdownSelect('logout')
                      setAuthenticated(false)
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </>
            ) : (
              <>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onSelect={() => {
                      handleUserDropdownSelect('login')
                      setAuthenticated(true)
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleUserDropdownSelect('register')}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Register</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </>
            )}
          </DropdownMenu>
        </div>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] min-w-[calc(55vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div className="grid w-full grid-cols-1 content-start items-center justify-center gap-4">
          <div className="col-span-1">
            <div className="text-4xl font-bold">Shadcn CRA Starter</div>
            <div className="text-lg text-muted-foreground">
              The advantages of Create-React-App and Shadcn UI, all in one place
            </div>
          </div>
          <Card className="h-72">
            <CardHeader>
              <CardTitle>Components</CardTitle>
              <CardDescription>Adding Components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Step 1: Use the{' '}
                <a target="_blank" rel="noreferrer" href="https://ui.shadcn.com/docs/cli" className="underline">
                  Shadcn-UI CLI Tool
                </a>
              </div>
              <div className="rounded border bg-muted p-2 text-sm text-muted-foreground">
                <p className="font-mono">npx shadcn-ui@latest add button</p>
              </div>
              <div className="text-sm text-muted-foreground">Step 2: Use it !</div>
              <Button variant="outline" onClick={() => setCount((count) => count + 1)}>
                Count is {count}
              </Button>
            </CardContent>
          </Card>
          {/* Users Page */}
          <Card className="">
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Users Table</CardDescription>
            </CardHeader>
            <CardContent className="">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in volutpat leo. Quisque congue
                vestibulum quam. Maecenas accumsan ipsum risus, sed ullamcorper nunc fringilla blandit. Vivamus pretium
                aliquet est, sit amet sagittis erat egestas in.
              </p>
              <Users />
            </CardContent>
          </Card>
          {/**/}
          <Card className="h-72">
            <CardHeader>
              <CardTitle>Dark Mode</CardTitle>
              <CardDescription>Choose between Light, Dark, or System Theme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-1 text-sm text-muted-foreground">Example:</div>
              <div className="flex items-center gap-2 rounded border p-4">
                <ModeToggle />
                <span className="mr-4 align-middle">
                  Current Theme: <CodeText>{theme}</CodeText>
                </span>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <p>
                A Modified version of Shadcn's{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://ui.shadcn.com/docs/dark-mode/vite"
                  className="underline"
                >
                  Vite Dark Mode
                </a>{' '}
                is being used for the <CodeText>mode-toggle.tsx</CodeText> and <CodeText>theme-provider.tsx</CodeText>{' '}
                files
              </p>
            </CardFooter>
          </Card>
          <Card className="h-72">
            <CardHeader>
              <CardTitle>Theming & Customization</CardTitle>
              <CardDescription>Make this app yours</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="ml-4 list-disc">
                <li>
                  There is a <CodeText>components.json</CodeText> file that will edit what gets added when you use the
                  cli 'add' functionality. More info{' '}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://ui.shadcn.com/docs/components-json"
                    className="underline"
                  >
                    here
                  </a>
                  .
                </li>
                <li>
                  You can edit the colors and look of your app by updating the <CodeText>index.css</CodeText> file with
                  css generated from the{' '}
                  <a target="_blank" rel="noreferrer" href="https://ui.shadcn.com/themes" className="underline">
                    shadcn-ui Theming Page
                  </a>
                  .
                </li>
              </ul>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <p>
                You don't have to run <CodeText>npx shadcn-ui init</CodeText>. That is what generated the components
              </p>
            </CardFooter>
          </Card>
          <Card className="">
            <CardHeader>
              <CardTitle>Contribute to This Starter</CardTitle>
              <CardDescription>Have any suggestions?</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="ml-4 list-disc">
                <li>
                  Check out the{' '}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://github.com/ahmad1702/shadcn-ui-cra"
                    className="underline"
                  >
                    react-shadcn-cra
                  </a>{' '}
                  repo.
                </li>
                <li>
                  You can{' '}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://github.com/ahmad1702/shadcn-ui-cra/issues/new"
                    className="underline"
                  >
                    open an issue
                  </a>{' '}
                  for any bugs you run into as well as for any suggestions you may have.
                </li>
                <li>
                  We are open to making this fit the use cases for all in order to decrease the amount of time to start
                  a new application using ShadcnUI and CRA.
                </li>
              </ul>
              <p className="pt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque in volutpat leo. Quisque congue
                vestibulum quam. Maecenas accumsan ipsum risus, sed ullamcorper nunc fringilla blandit. Vivamus pretium
                aliquet est, sit amet sagittis erat egestas in. Fusce congue dolor sit amet malesuada venenatis. In
                pretium ornare tellus sit amet consectetur. Integer rutrum iaculis libero, vitae pretium odio volutpat
                sit amet. Nullam vel magna mauris. Phasellus lacinia nisl justo, ac suscipit purus convallis faucibus.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
              </p>
              <p className="pt-4">
                Morbi nec mauris aliquam, dapibus elit et, varius ex. Duis enim orci, vehicula ut sollicitudin
                fermentum, laoreet sed nibh. Quisque quis nibh in eros blandit tristique. Nulla varius blandit lacus,
                vel sagittis tortor vulputate sit amet. Ut sit amet laoreet diam. Ut quis orci erat. Curabitur mollis
                ipsum non enim commodo egestas. Proin tristique felis in leo facilisis rutrum. Donec efficitur risus sed
                justo commodo consequat. Mauris ultricies nisi ligula, ut lacinia dui lobortis in. Vestibulum ante ipsum
                primis in faucibus orci luctus et ultrices posuere cubilia curae;
              </p>
              <p>
                Mauris auctor, tellus eget rutrum placerat, neque diam condimentum odio, vitae suscipit diam massa id
                orci. Vivamus eu massa urna. Suspendisse a hendrerit ante, eget pharetra urna. Ut lacinia tincidunt
                nunc, eu efficitur nunc ornare id. Ut aliquam interdum mollis. Nullam ut commodo mi. Vestibulum
                lobortis, ipsum quis malesuada venenatis, mi magna posuere quam, eu imperdiet elit ex ultrices tellus.
                Ut porttitor maximus orci a sagittis. Praesent vulputate felis sit amet nisl congue scelerisque.
                Phasellus diam ante, accumsan id iaculis sit amet, dapibus a mi. In id consequat ligula, a tristique
                dolor. Nunc luctus porttitor venenatis. Donec mattis eget purus vel ornare. Nunc suscipit lorem porta
                porttitor blandit. Fusce sagittis euismod tellus, euismod sodales eros ullamcorper vel. Fusce id felis
                dui.
              </p>
              <p className="pt-4">
                Cras sed finibus velit. Proin suscipit augue eu felis consectetur hendrerit. Mauris pharetra metus
                molestie erat scelerisque viverra. Donec vel lorem nisi. Aenean venenatis semper sem, id blandit nulla
                consectetur ut. Nulla tincidunt ipsum lacus, tincidunt ullamcorper metus fringilla eget. Morbi vehicula
                tortor a sem imperdiet, id molestie urna semper. In sem mi, maximus non velit tempus, feugiat
                consectetur tortor. Fusce nec sem sodales, elementum lectus et, blandit mi. Integer molestie ornare erat
                eu dictum. Proin vulputate et nulla nec cursus. Nunc vel nulla sagittis, posuere velit vel, elementum
                dui. Curabitur erat sapien, pellentesque vel lobortis vel, venenatis in libero. Maecenas mauris libero,
                tincidunt quis leo in, bibendum ullamcorper lectus. Morbi neque sem, finibus eget dapibus at, rhoncus
                sed odio.
              </p>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              <p>
                There is also a{' '}
                <a
                  target="_blank"
                  rel="noreferrer"
                  href="https://github.com/ahmad1702/shadcn-ui-vite"
                  className="underline"
                >
                  Vite React version of this starter
                </a>
                .
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="flex h-16 items-center justify-center border-t bg-background px-4 md:px-6">
        <div className="flex items-center gap-4">
          <MessageSquare className="h-5 w-5" />
          <span className="text-muted-foreground">Made with ❤️ & Shadcn</span>
        </div>
      </footer>
    </div>
  )
}

export default App
