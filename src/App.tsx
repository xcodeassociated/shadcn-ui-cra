import React, { ComponentProps, useState } from 'react'
import { ModeToggle } from './components/mode-toggle'
import { useTheme } from './components/theme-provider'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card'
import { cn } from './lib/utils'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Search, UserCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
      <NavigationMenuLink className={navigationMenuTriggerStyle() + ' cursor-pointer'}
                          active={location.pathname === item.route}
                          onClick={() => navigate(item.route)}>
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
        className={((location.pathname === item.route) ? 'text-xl' : 'text-xl text-muted-foreground') +
          ' hover:text-foreground p-2 border bg-muted rounded cursor-pointer'}
        onClick={() => navigate(item.route)}>
        {item.key}
      </Label>
    </SheetClose>
  )
}

const CodeText = (props: ComponentProps<'span'>) => {
  return <span {...props}
               className={cn(props.className, 'bg-muted text-muted-foreground rounded font-mono text-sm p-1')} />
}

// todo: replace with actual auth check
const authenticated = true

function App() {
  const [count, setCount] = useState(0)
  const { theme } = useTheme()
  const { t } = useTranslation(['main'])
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(`search: ${e.currentTarget.search.value}`)
    e.currentTarget.reset()
  }

  const handleUserDropdownSelect = (item: string) => {
    console.log(`User dropdown change: ${item}`)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav
          className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Label className="flex items-center gap-2 text-lg font-semibold md:text-base cursor-pointer"
                 onClick={() => navigate('/')}>Shadcn</Label>
          <NavigationMenu>
            <NavigationMenuList>
              {menuItems.filter((item) => item.restricted ? authenticated : true).map((item) => (
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
              {menuItems.filter((item) => item.restricted ? authenticated : true).map((item) => (
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
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleUserDropdownSelect('settings')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleUserDropdownSelect('support')}>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleUserDropdownSelect('logout')}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main
        className="flex min-h-[calc(100vh_-_theme(spacing.16))] min-w-[calc(55vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        <div
          className="w-full grid grid-cols-1 gap-4 content-start items-center justify-center">
          <div className="col-span-1">
            <div className="text-4xl font-bold">Shadcn CRA Starter</div>
            <div className="text-lg text-muted-foreground">The advantages of
              Create-React-App and Shadcn UI, all in one place
            </div>
          </div>
          <Card className="h-72">
            <CardHeader>
              <CardTitle>Components</CardTitle>
              <CardDescription>Adding Components</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-muted-foreground text-sm">
                Step 1: Use the <a target="_blank" rel="noreferrer"
                                   href="https://ui.shadcn.com/docs/cli"
                                   className="underline">Shadcn-UI CLI
                Tool</a>
              </div>
              <div
                className="text-sm p-2 rounded border bg-muted text-muted-foreground">
                <p className="font-mono">npx shadcn-ui@latest add button</p>
              </div>
              <div className="text-muted-foreground text-sm">
                Step 2: Use it !
              </div>
              <Button variant="outline"
                      onClick={() => setCount((count) => count + 1)}>
                Count is {count}
              </Button>
            </CardContent>
          </Card>
          <Card className="h-72">
            <CardHeader>
              <CardTitle>Dark Mode</CardTitle>
              <CardDescription>Choose between Light, Dark, or System Theme</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm mb-1">
                Example:
              </div>
              <div className="border rounded p-4 flex items-center gap-2">
                <ModeToggle />
                <span
                  className="mr-4 align-middle">Current Theme: <CodeText>{theme}</CodeText></span>
              </div>
            </CardContent>
            <CardFooter className="text-muted-foreground text-sm">
              <p>A Modified version of Shadcn's <a target="_blank"
                                                   rel="noreferrer"
                                                   href="https://ui.shadcn.com/docs/dark-mode/vite"
                                                   className="underline">Vite Dark Mode</a> is being used for
                the <CodeText>mode-toggle.tsx</CodeText> and <CodeText>theme-provider.tsx</CodeText> files
              </p>
            </CardFooter>
          </Card>
          <Card className="h-72">
            <CardHeader>
              <CardTitle>Theming & Customization</CardTitle>
              <CardDescription>Make this app yours</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc ml-4">
                <li>There is a <CodeText>components.json</CodeText> file
                  that will edit what gets added when you
                  use
                  the cli 'add' functionality. More info <a target="_blank"
                                                            rel="noreferrer"
                                                            href="https://ui.shadcn.com/docs/components-json"
                                                            className="underline">here</a>.
                </li>
                <li>You can edit the colors and look of your app by updating
                  the <CodeText>index.css</CodeText> file
                  with css generated from the <a target="_blank"
                                                 rel="noreferrer"
                                                 href="https://ui.shadcn.com/themes"
                                                 className="underline">shadcn-ui
                    Theming Page</a>.
                </li>
              </ul>
            </CardContent>
            <CardFooter className="text-muted-foreground text-sm">
              <p>You don't have to run <CodeText>npx shadcn-ui
                init</CodeText>. That is what generated the
                components
              </p>
            </CardFooter>
          </Card>
          <Card className="">
            <CardHeader>
              <CardTitle>Contribute to This Starter</CardTitle>
              <CardDescription>Have any suggestions?</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc ml-4">
                <li>Check out the <a target="_blank" rel="noreferrer"
                                     href="https://github.com/ahmad1702/shadcn-ui-cra"
                                     className="underline">react-shadcn-cra</a> repo.
                </li>
                <li>You can <a target="_blank" rel="noreferrer"
                               href="https://github.com/ahmad1702/shadcn-ui-cra/issues/new"
                               className="underline">open
                  an issue</a> for any bugs you run into as well as for any
                  suggestions you may have.
                </li>
                <li>We are open to making this fit the use cases for all in
                  order to decrease the amount of time
                  to
                  start a new application using ShadcnUI and CRA.
                </li>
              </ul>
              <p className="pt-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Pellentesque in volutpat leo. Quisque congue vestibulum quam.
                Maecenas accumsan ipsum risus, sed ullamcorper nunc fringilla
                blandit. Vivamus pretium aliquet est, sit amet sagittis erat
                egestas in. Fusce congue dolor sit amet malesuada venenatis. In
                pretium ornare tellus sit amet consectetur. Integer rutrum
                iaculis libero, vitae pretium odio volutpat sit amet. Nullam vel
                magna mauris. Phasellus lacinia nisl justo, ac suscipit purus
                convallis faucibus. Vestibulum ante ipsum primis in faucibus
                orci luctus et ultrices posuere cubilia curae;
              </p>
              <p className="pt-4">
                Morbi nec mauris aliquam, dapibus elit et, varius ex. Duis enim
                orci, vehicula ut sollicitudin fermentum, laoreet sed nibh.
                Quisque quis nibh in eros blandit tristique. Nulla varius
                blandit lacus, vel sagittis tortor vulputate sit amet. Ut sit
                amet laoreet diam. Ut quis orci erat. Curabitur mollis ipsum non
                enim commodo egestas. Proin tristique felis in leo facilisis
                rutrum. Donec efficitur risus sed justo commodo consequat.
                Mauris ultricies nisi ligula, ut lacinia dui lobortis in.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                posuere cubilia curae;
              </p>
              <p>
                Mauris auctor, tellus eget rutrum placerat, neque diam
                condimentum
                odio, vitae suscipit diam massa id orci. Vivamus eu massa urna.
                Suspendisse a hendrerit ante, eget pharetra urna. Ut lacinia
                tincidunt nunc, eu efficitur nunc ornare id. Ut aliquam interdum
                mollis. Nullam ut commodo mi. Vestibulum lobortis, ipsum quis
                malesuada venenatis, mi magna posuere quam, eu imperdiet elit ex
                ultrices tellus. Ut porttitor maximus orci a sagittis. Praesent
                vulputate felis sit amet nisl congue scelerisque. Phasellus diam
                ante, accumsan id iaculis sit amet, dapibus a mi. In id
                consequat
                ligula, a tristique dolor. Nunc luctus porttitor venenatis.
                Donec
                mattis eget purus vel ornare. Nunc suscipit lorem porta
                porttitor
                blandit. Fusce sagittis euismod tellus, euismod sodales eros
                ullamcorper vel. Fusce id felis dui.
              </p>
              <p className="pt-4">
                Cras sed finibus velit. Proin suscipit augue eu felis
                consectetur hendrerit. Mauris pharetra metus molestie erat
                scelerisque viverra. Donec vel lorem nisi. Aenean venenatis
                semper sem, id blandit nulla consectetur ut. Nulla tincidunt
                ipsum lacus, tincidunt ullamcorper metus fringilla eget. Morbi
                vehicula tortor a sem imperdiet, id molestie urna semper. In sem
                mi, maximus non velit tempus, feugiat consectetur tortor. Fusce
                nec sem sodales, elementum lectus et, blandit mi. Integer
                molestie ornare erat eu dictum. Proin vulputate et nulla nec
                cursus. Nunc vel nulla sagittis, posuere velit vel, elementum
                dui. Curabitur erat sapien, pellentesque vel lobortis vel,
                venenatis in libero. Maecenas mauris libero, tincidunt quis leo
                in, bibendum ullamcorper lectus. Morbi neque sem, finibus eget
                dapibus at, rhoncus sed odio.
              </p>
            </CardContent>
            <CardFooter className="text-muted-foreground text-sm">
              <p>There is also a <a target="_blank" rel="noreferrer"
                                    href="https://github.com/ahmad1702/shadcn-ui-vite"
                                    className="underline">Vite
                React version of this starter</a>.</p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>


  )
}

export default App
