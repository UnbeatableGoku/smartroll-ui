export default {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'subject-empty': [0, 'always'],
    'type-empty': [0, 'always'],
    'custom-rule': [2, 'never'], // Custom rule to be enforced
  },
  plugins: [
    {
      rules: {
        'custom-rule': ({ header }) => {
          const allowedTypes = [
            'feat:',
            'fix:',
            'ui:',
            'docs:',
            'refactor:',
            'setup:',
          ]

          const splittedHeader = header.split(' ')
          const regexPattern = /^\[SMR-(\d+)\]/

          const regexMatch = splittedHeader[0].trim().match(regexPattern)
          if (!regexMatch) {
            return [
              false,
              'Please add proper task number in the format: [SMR-<number>]',
            ]
          } else if (!allowedTypes.includes(`${splittedHeader[1].trim()}`)) {
            return [
              false,
              `Type should be one of the ${allowedTypes.join(',')}`,
            ]
          } else {
            return [true, 'Valid commit message.']
          }
        },
      },
    },
  ],
}
