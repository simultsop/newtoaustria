/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.133.0/http/server.ts";
import { router } from "https://crux.land/router@0.0.11";
import { h, ssr } from "https://crux.land/nanossr@0.0.4";

const render = (component) => ssr(() => <App>{component}</App>);

const infoTree = ["GDP", "Country code", "Alpha code 2", "Alpha code 3", "Official Language/s", "Population", "Area", "Independence", "Towns"];
const states = ["Burgenland", "Carinthia", "Lower Austria", "Upper Austria", "Salzburg", "Styria", "Tyrol", "Vorarlberg", "Vienna"];

function convertToSlug(Text) {
  return Text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '_');
}

serve(router(
  {
    "/": () => render(<Landing />),
    "/burgenland": () => render(<Burgenland />),
    "/carinthia": () => render(<Carinthia />),
    "/lower_austria": () => render(<LowerAustria />),
    "/upper_austria": () => render(<UpperAustria />),
    "/salzburg": () => render(<Salzburg />),
    "/styria": () => render(<Styria />),
    "/tyrol": () => render(<Tyrol />),
    "/vorarlberg": () => render(<Vorarlberg />),
    "/vienna": () => render(<Vienna />),
  },
  () => render(<NotFound />),
));

function Landing() { return State('Austria', 'austria'); }
function Burgenland() { return State('Burgenland', 'burgenland'); }
function Carinthia() { return State('Carinthia', 'carinthia'); }
function LowerAustria() { return State('Lower Austria', 'lower_austria'); }
function UpperAustria() { return State('Upper Austria', 'upper_austria'); }
function Salzburg() { return State('Salzburg', 'salzburg'); }
function Styria() { return State('Styria', 'styria'); }
function Tyrol() { return State('Tyrol', 'tyrol'); }
function Vorarlberg() { return State('Vorarlberg', 'vorarlberg'); }
function Vienna() { return State('Vienna', 'vienna'); }

function App({ children }) {
  return (
    <div class="min-h-screen">
      <NavBar />
      {children}
    </div>
  );
}

function NavBar() {
  return (
    <header class="bg-red-500">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div class="w-full py-6 flex items-center justify-between border-b border-red-400 lg:border-none">
          <div class="flex items-center">
            <a href="#" class="text-white font-medium">
              <span class="sr-only">Austria</span>
              Austria
            </a>
            <div class="hidden ml-10 space-x-8 lg:block">
              {
                states.map(state => {
                  return (<a href={convertToSlug(state)} class="text-base text-white hover:text-indigo-50">{state}</a>)
                })
              }
            </div>
          </div>
        </div>
        <div class="py-4 flex flex-wrap justify-center space-x-6 lg:hidden">
          {
            states.map(state => {
              return (<a href={convertToSlug(state)} class="text-base text-white hover:text-indigo-50">{state}</a>)
            })
          }
        </div>
      </nav>
    </header>
  );
}

function State(state, slug) {
  const stateInfo = Deno.env.get(slug).split(',');
  return (
    <div class="flex justify-center items-center">
      <div class="max-w-7xl py-12 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">State</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">{state}</p>
          </div>
          <div class="border-t border-gray-200">
            <dl>
              {
                infoTree.map((info, key) => {
                  return RenderInfo(info, stateInfo[key])
                })
              }
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function RenderInfo(info, value) {
  function formatLongNumber(value) { return new Intl.NumberFormat().format(Number(value))}
  function normalizePrice(value) { return formatLongNumber(value) + '€'; }
  function normalizeArea(value) { return formatLongNumber(value) + ' km²'; }
  function render(value) {
    return(<div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium text-gray-500">{info}</dt>
      <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value}</dd>
    </div>)
  }

  switch(info) {
    case 'GDP':
      return render(normalizePrice(value))
      break;
    case 'Population':
      return render(formatLongNumber(value))
      break;
    case 'Area':
      return render(normalizeArea(value))
      break;

    default:
      return render(value);
  }
}

function NotFound() {
  return (
    <div class="min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div class="max-w-max mx-auto">
        <main class="sm:flex">
          <p class="text-4xl font-extrabold text-indigo-600 sm:text-5xl">404</p>
          <div class="sm:ml-6">
            <div class="sm:border-l sm:border-gray-200 sm:pl-6">
              <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">Page not found</h1>
              <p class="mt-1 text-base text-gray-500">Please check the URL in the address bar and try again.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
