import { ReactElement, lazy, createElement, Suspense } from 'react';
import Loader from '../components/Loader';

export default function componentResolver(section: any, index: number) : ReactElement {

    // Component names do look like 'category.component-name' => lowercase and kebap case
    const names: string[] = section.__component.split('.')

    // Get category name
    const category = names[0]

    // Get component name
    const component = names[1]

    ///////////////////////////////////////////////
    // Convert the kebap-case name to PascalCase
    const parts: string[] = component.split('-')

    let componentName = ''

    parts.forEach( s => {
        componentName += capitalizeFirstLetter(s)
    })
    ///////////////////////////////////////////////

    //console.log(`ComponentResolver: Category => ${category} | Component => ${componentName} | Path => ../components/${componentName}`)
    console.log(`🔧 ComponentResolver: Loading ${section.__component} -> ${componentName}`);
    console.log(`📦 ComponentResolver Data:`, section);

    // The path for dynamic imports cannot be fully dynamic.
    // Webpack requires a static part of the import path at the beginning. 
    // All modules below this path will be included in the bundle and be available for dynamic loading
    // Besides, this will result in code splitting and better performance.
    // See https://webpack.js.org/api/module-methods/#import-1
    
    // Use react lazy loading to import the module. By convention: The file name needs to match the name of the component (what is a good idea)
    let module = lazy(() => 
        import( `@/app/[lang]/components/${componentName}`)
            .catch(error => {
                console.error(`❌ ComponentResolver: Failed to load component ${componentName}:`, error);
                // Return a fallback component
                return { default: () => (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                        <h3 className="text-red-800 font-semibold">Component Error</h3>
                        <p className="text-red-600 text-sm">Failed to load component: {componentName}</p>
                        <details className="mt-2">
                            <summary className="text-xs text-red-500 cursor-pointer">Debug Info</summary>
                            <pre className="text-xs text-red-500 mt-1 overflow-auto">
                                Component: {section.__component}{'\n'}
                                Expected File: {componentName}.tsx
                            </pre>
                        </details>
                    </div>
                )};
            })
    )

    // Create react element. The 'type' argument needs to be a FunctionComponent, not a string
    const reactElement = createElement(module, {data: section, key: index})
    console.log(`✅ ComponentResolver: Successfully loaded component -> ${componentName}`);

    return (
        <Suspense fallback={<Loader />} key={index}>
            {reactElement}
        </Suspense>
    )
}

function capitalizeFirstLetter(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}