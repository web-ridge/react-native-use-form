import * as React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { registerTranslation, en, nl } from 'react-native-use-form';
import { Text } from 'react-native-paper';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Language } from './types';
import { HeroSection } from './components/HeroSection';
import { LibraryAdvantages } from './components/LibraryAdvantages';
import { SEOArticle } from './components/SEOArticle';
import { UserProfileDemo } from './demos/UserProfileDemo';
import { ArticleDemo } from './demos/ArticleDemo';
import { PaymentDemo } from './demos/PaymentDemo';
import { RegistrationDemo } from './demos/RegistrationDemo';

registerTranslation('en', en);
registerTranslation('nl', nl);

type Tab = 'home' | 'profile' | 'article' | 'payment' | 'registration';

interface TabButtonProps {
  active: boolean;
  onPress: () => void;
  icon: string;
  label: string;
}

function TabButton({ active, onPress, icon, label }: TabButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.tab, active && styles.tabActive]}
      activeOpacity={0.7}
    >
      <Text style={[styles.tabIcon, active && styles.tabIconActive]}>
        {icon}
      </Text>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
        {label}
      </Text>
      {active && <View style={styles.tabIndicator} />}
    </TouchableOpacity>
  );
}

export default function App() {
  const [locale, setLocale] = useState<Language>(Language.EN);
  const [selectedTab, setSelectedTab] = useState<Tab>('home');

  return (
    <SafeAreaProvider style={{ height: '100lvh' }}>
      <View style={styles.tabBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}
        >
          <TabButton
            active={selectedTab === 'home'}
            onPress={() => setSelectedTab('home')}
            icon="🏠"
            label="Home"
          />
          <TabButton
            active={selectedTab === 'article'}
            onPress={() => setSelectedTab('article')}
            icon="📝"
            label="Article"
          />
          <TabButton
            active={selectedTab === 'profile'}
            onPress={() => setSelectedTab('profile')}
            icon="👤"
            label="Profile"
          />
          <TabButton
            active={selectedTab === 'payment'}
            onPress={() => setSelectedTab('payment')}
            icon="💳"
            label="Payment"
          />
          <TabButton
            active={selectedTab === 'registration'}
            onPress={() => setSelectedTab('registration')}
            icon="🔐"
            label="Register"
          />
        </ScrollView>

        {/* Language Toggle */}
        <View style={styles.tabBarControls}>
          <TouchableOpacity
            onPress={() =>
              setLocale(locale === Language.EN ? Language.NL : Language.EN)
            }
            style={styles.langButton}
          >
            <Text style={styles.langButtonText}>
              {locale === Language.EN ? '🇺🇸' : '🇳🇱'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {selectedTab === 'home' && (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <HeroSection />
              <LibraryAdvantages />

              <View style={styles.getStartedCard}>
                <Text style={styles.getStartedTitle}>🚀 Get Started</Text>
                <Text style={styles.getStartedText}>
                  Click on the tabs above to explore interactive demos
                  showcasing different validation patterns:
                </Text>
                <View style={styles.demoList}>
                  <Text style={styles.demoListItem}>
                    📝 <Text style={styles.demoListBold}>Article</Text> -
                    Ref-based dynamic validation
                  </Text>
                  <Text style={styles.demoListItem}>
                    👤 <Text style={styles.demoListBold}>Profile</Text> - Basic
                    validation patterns
                  </Text>
                  <Text style={styles.demoListItem}>
                    💳 <Text style={styles.demoListBold}>Payment</Text> - Nested
                    objects & auto-formatting
                  </Text>
                  <Text style={styles.demoListItem}>
                    🔐 <Text style={styles.demoListBold}>Register</Text> -
                    Cross-field validation
                  </Text>
                </View>
              </View>

              <SEOArticle />
            </View>
          </ScrollView>
        )}

        {selectedTab === 'profile' && <UserProfileDemo locale={locale} />}
        {selectedTab === 'article' && <ArticleDemo locale={locale} />}
        {selectedTab === 'payment' && <PaymentDemo locale={locale} />}
        {selectedTab === 'registration' && <RegistrationDemo locale={locale} />}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: Platform.OS === 'ios' ? 50 : 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tabBarContent: {
    paddingHorizontal: 8,
    paddingBottom: 4,
    gap: 4,
  },
  tabBarControls: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 54 : 14,
    flexDirection: 'row',
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
    position: 'relative',
  },
  tabActive: {
    // Active state handled by indicator
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabLabelActive: {
    color: '#6366f1',
    fontWeight: '700',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#6366f1',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  langButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  langButtonText: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  getStartedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  getStartedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1f2937',
  },
  getStartedText: {
    fontSize: 15,
    color: '#6b7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  demoList: {
    gap: 12,
  },
  demoListItem: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 24,
  },
  demoListBold: {
    fontWeight: '700',
    color: '#1f2937',
  },
});
