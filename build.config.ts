import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
    entries: [{
        input: 'src/cli.tsx',
        name: 'oil'
    }],
    clean: true,
    declaration: true,
    rollup: {
        emitCJS: true,
        inlineDependencies: true,
        commonjs: {
            exclude: ['**/*.d.ts'],
        },
    },
})
