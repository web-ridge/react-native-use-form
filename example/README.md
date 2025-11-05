# React Native Use Form - Example App

## 📁 Project Structure

This example app demonstrates the full power of **react-native-use-form** with a modern, well-organized TypeScript structure.

```
src/
├── App.tsx                          # Main app component
├── types.ts                         # TypeScript type definitions
├── TextInputWithError.tsx           # Reusable input component
│
├── components/                      # Reusable UI components
│   ├── HeroSection.tsx             # Hero banner with features
│   ├── JsonStateViewer.tsx         # Live JSON state display
│   └── LibraryAdvantages.tsx       # Library benefits showcase
│
└── demos/                           # Form demonstrations
    ├── ArticleDemo.tsx             # 📝 Ref-based dynamic validation
    ├── UserProfileDemo.tsx         # 👤 Basic validation patterns
    ├── PaymentDemo.tsx             # 💳 Nested objects & auto-formatting
    └── RegistrationDemo.tsx        # 🔐 Cross-field validation
```

## 🎯 Demo Forms

### 1. **Article Form** (Ref-Based Dynamic Validation)

The star feature! Demonstrates how validation rules change based on which submit button is pressed:

- **Save Draft**: Lenient validation, allows partial data
- **Publish**: Strict validation with complete requirements
- Uses `useRef` to store the submit mode
- Pre-submit validation re-executes with the current ref value

**Key Code:**

```typescript
const submitModeRef = useRef<'draft' | 'publish' | null>(null);

// ✨ No explicit type needed! TypeScript infers types from initial values
const [formState, fh] = useFormState(
  {
    title: '',
    content: '',
    category: '',
    tags: '',
  },
  {
    /* options */
  }
);

// In validation:
validate: (v) => {
  const submitMode = submitModeRef.current;
  if (submitMode === 'publish') {
    // Strict rules
  }
};

// On button press:
submitModeRef.current = 'publish';
formState.submit(); // Pre-submit validation runs with new ref value!
```

### 2. **User Profile Form** (Basic Validation)

- Required fields
- Email regex validation
- Phone number format
- Character limits

### 3. **Payment Form** (Nested Objects)

- Nested validation: `billingAddress.street`, `billingAddress.city`
- Auto-formatting for card numbers and expiry dates
- Complex field validation (Luhn algorithm ready)
- Multiple fields in rows

### 4. **Registration Form** (Cross-Field Validation)

- Password strength requirements
- Password matching (`confirmPassword` must equal `password`)
- Regex patterns for username
- Age validation
- Terms acceptance with exact string match

## ✨ Features Demonstrated

### Automatic Type Inference 🔥

**No explicit types needed!** The library automatically infers all types from your initial values:

```typescript
// ❌ Old way (still works):
const [formState, fh] = useFormState<UserProfileForm>({ firstName: '', ... })

// ✅ New way (cleaner!):
const [formState, fh] = useFormState({ firstName: '', lastName: '', email: '' })
// TypeScript knows all field types automatically!
```

Even works with nested objects:

```typescript
const [formState, fh] = useFormState({
  billingAddress: {
    street: '',
    city: '',
    zipCode: '',
  },
});
// fh.text('billingAddress.street') is fully typed! 🎉
```

### Pre-Submit Validation ⭐

All fields are re-validated immediately before submission:

- Catches dynamic validation changes
- Works with ref-based validation
- Ensures data integrity

### Dynamic Validation Rules

- Change validation based on button pressed
- Conditional requirements
- Context-aware validation

### TypeScript Type Safety

- Fully typed form state
- Dot-notation paths: `billingAddress.zipCode`
- Auto-complete for field names
- Type-safe value access

### i18n Support

- Switch between English and Dutch
- Customizable error messages
- Extensible translation system

### Live JSON State Viewer

- See form state in real-time
- Debug values, errors, touched state
- Toggle on/off for cleaner UI

### Beautiful Modern UI

- Material Design with React Native Paper
- Responsive layout
- Info boxes explaining features
- Color-coded badges
- Smooth interactions

## 🚀 Running the App

```bash
# From the example directory:
npm start

# Then choose:
# - Press 'w' for web
# - Press 'a' for Android
# - Press 'i' for iOS
```

## 📚 Learn More

Each demo file is well-commented and can be studied independently. The code is production-ready and follows best practices.

### Best Practices Used:

- ✅ Separated concerns (components, demos, types)
- ✅ Reusable components
- ✅ Type-safe validation
- ✅ Clear file structure
- ✅ Modern React patterns (hooks, functional components)
- ✅ Accessibility considerations
- ✅ Performance optimizations

## 💡 Tips

1. **Start with ArticleDemo**: It shows the most advanced feature (ref-based validation)
2. **Check PaymentDemo**: See how nested objects work with dot notation
3. **Study RegistrationDemo**: Learn cross-field validation patterns
4. **Enable JSON viewer**: Watch the state change in real-time

## 🎨 Customization

All styles are in StyleSheet at the bottom of each file. Colors and spacing can be easily customized to match your brand.

---

**Built with ❤️ to showcase the power of react-native-use-form**
