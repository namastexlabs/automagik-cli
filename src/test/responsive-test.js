#!/usr/bin/env node

/**
 * Simple test script to verify responsive layout calculations
 */

// Simulate responsive layout calculations
function calculateResponsiveLayout(width, height, options = {}) {
  const {
    minInputWidth = 20,
    widthFraction = 0.9,
  } = options;

  // Determine breakpoint
  let breakpoint;
  if (width < 80) {
    breakpoint = 'small';
  } else if (width < 120) {
    breakpoint = 'medium';
  } else {
    breakpoint = 'large';
  }

  const isSmall = breakpoint === 'small';
  const isMedium = breakpoint === 'medium';
  const isLarge = breakpoint === 'large';
  const isNarrow = width < 100;
  const isWide = width > 140;
  const isShort = height < 20;
  const isTall = height > 40;

  // Width calculations
  let maxContentWidth, inputWidthCalc, suggestionsWidthCalc;
  
  if (isSmall) {
    maxContentWidth = Math.max(width - 4, 20);
    inputWidthCalc = Math.max(minInputWidth, width - 8);
    suggestionsWidthCalc = Math.max(30, width - 10);
  } else if (isMedium) {
    maxContentWidth = Math.floor(width * 0.85);
    inputWidthCalc = Math.max(minInputWidth, Math.floor(width * widthFraction) - 3);
    suggestionsWidthCalc = Math.max(50, Math.floor(width * 0.75));
  } else {
    maxContentWidth = Math.floor(width * 0.8);
    inputWidthCalc = Math.max(minInputWidth, Math.floor(width * widthFraction) - 3);
    suggestionsWidthCalc = Math.max(60, Math.floor(width * 0.8));
  }
  
  const headerHeight = isShort ? 1 : 2;
  const footerHeight = isShort ? 1 : 2;
  const maxContentHeight = Math.max(height - headerHeight - footerHeight - 2, 5);
  
  return {
    width,
    height,
    breakpoint,
    isSmall,
    isMedium,
    isLarge,
    isNarrow,
    isWide,
    isShort,
    isTall,
    maxContentWidth,
    maxContentHeight,
    inputWidth: inputWidthCalc,
    suggestionsWidth: suggestionsWidthCalc,
    headerHeight,
    footerHeight,
  };
}

// Test different screen sizes
const testCases = [
  { width: 60, height: 15, expected: 'small' },    // Very small mobile-like
  { width: 80, height: 20, expected: 'medium' },   // Small terminal
  { width: 100, height: 30, expected: 'medium' },  // Standard terminal
  { width: 120, height: 40, expected: 'large' },   // Large terminal
  { width: 160, height: 50, expected: 'large' },   // Very large terminal
];

console.log('🧪 Testing Responsive Layout System\n');

testCases.forEach(({ width, height, expected }, index) => {
  const layout = calculateResponsiveLayout(width, height);
  
  console.log(`📐 Test ${index + 1}: ${width}x${height} (expected: ${expected})`);
  console.log(`   Breakpoint: ${layout.breakpoint} ${layout.breakpoint === expected ? '✅' : '❌'}`);
  console.log(`   Max Content Width: ${layout.maxContentWidth}`);
  console.log(`   Input Width: ${layout.inputWidth}`);
  console.log(`   Suggestions Width: ${layout.suggestionsWidth}`);
  console.log(`   Is Small: ${layout.isSmall}, Is Short: ${layout.isShort}`);
  console.log('');
});

console.log('✅ Responsive layout test completed!');
console.log('\n📊 Summary:');
console.log('- Small screens (<80 cols): Compact layout, minimal padding');
console.log('- Medium screens (80-120 cols): Balanced layout');
console.log('- Large screens (>120 cols): Comfortable spacing');
console.log('- Short terminals (<20 rows): Reduced margins');
console.log('- Tall terminals (>40 rows): Standard spacing');

// Test edge cases
console.log('\n🔍 Edge Case Tests:');

const edgeCases = [
  { width: 10, height: 5, desc: 'Extremely small' },
  { width: 79, height: 19, desc: 'Just below medium threshold' },
  { width: 121, height: 41, desc: 'Just above large threshold' },
];

edgeCases.forEach(({ width, height, desc }) => {
  const layout = calculateResponsiveLayout(width, height);
  console.log(`   ${desc} (${width}x${height}): ${layout.breakpoint}, content: ${layout.maxContentWidth}, input: ${layout.inputWidth}`);
});