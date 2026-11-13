import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {
    BasicDropdown,
    SearchableDropdown,
    MultiSelectDropdown,
    CheckboxDropdown,
    CountryDropdown,
    CascadingDropdown,
    BottomSheetDropdown,
    GroupedDropdown,
    CustomDropdown,
    AutocompleteDropdown,
    Dropdown,
    ThemeProvider,
    useKeyboard,
    SAMPLE_CASCADING_DATA,
    DropdownItem,
    GroupedItem,
    CascadingItem,
    CountryData,
} from 'react-native-dropdown-uikit';

const CLOUD_PROVIDERS: DropdownItem<string>[] = [
    { label: 'Amazon Web Services (AWS)', value: 'aws', subtitle: 'Global enterprise cloud' },
    { label: 'Google Cloud Platform (GCP)', value: 'gcp', subtitle: 'AI & big data platform' },
    { label: 'Microsoft Azure', value: 'azure', subtitle: 'Hybrid enterprise solutions' },
    { label: 'DigitalOcean', value: 'do', subtitle: 'Simple developer cloud' },
    { label: 'Vercel & Supabase', value: 'vercel', subtitle: 'Frontend & serverless edge' },
];

const AIRPORTS: DropdownItem<string>[] = [
    { label: 'San Francisco Intl (SFO)', value: 'sfo', badge: 'USA' },
    { label: 'London Heathrow (LHR)', value: 'lhr', badge: 'UK' },
    { label: 'Tokyo Haneda (HND)', value: 'hnd', badge: 'Japan' },
    { label: 'Dubai International (DXB)', value: 'dxb', badge: 'UAE' },
    { label: 'Indira Gandhi Delhi (DEL)', value: 'del', badge: 'India' },
    { label: 'Singapore Changi (SIN)', value: 'sin', badge: 'Singapore' },
];

const TECH_STACK: DropdownItem<string>[] = [
    { label: 'React Native', value: 'rn', badge: 'Mobile' },
    { label: 'TypeScript', value: 'ts', badge: 'Core' },
    { label: 'GraphQL', value: 'gql', badge: 'API' },
    { label: 'Node.js', value: 'node', badge: 'Backend' },
    { label: 'Tailwind CSS', value: 'tailwind', badge: 'Styling' },
    { label: 'Docker & K8s', value: 'docker', badge: 'DevOps' },
];

const NOTIFICATIONS: DropdownItem<string>[] = [
    { label: 'Push Notifications', value: 'push', subtitle: 'Instant device alerts' },
    { label: 'Email Digest', value: 'email', subtitle: 'Weekly summary & invoices' },
    { label: 'SMS Security Alerts', value: 'sms', subtitle: 'Critical login alerts' },
    { label: 'Slack Webhook', value: 'slack', subtitle: 'Team channel broadcasts' },
];

const PAYMENT_METHODS: DropdownItem<string>[] = [
    { label: 'Apple Pay / Google Pay', value: 'pay', subtitle: 'Instant 1-tap checkout' },
    { label: 'Credit or Debit Card', value: 'card', subtitle: 'Visa, Mastercard, Amex' },
    { label: 'PayPal Account', value: 'paypal', subtitle: 'Secure buyer protection' },
    { label: 'Direct Bank Transfer', value: 'bank', subtitle: 'Zero processing fee' },
];

const GROUPED_SERVICES: GroupedItem<string>[] = [
    {
        title: 'Frontend & Mobile',
        data: [
            { label: 'React Native', value: 'rn', subtitle: 'iOS & Android' },
            { label: 'Next.js App Router', value: 'next', subtitle: 'Full-stack React' },
            { label: 'Vue.js / Nuxt', value: 'vue', subtitle: 'Progressive Framework' },
        ],
    },
    {
        title: 'Cloud & Database',
        data: [
            { label: 'PostgreSQL Server', value: 'pg', subtitle: 'Relational Database' },
            { label: 'Redis Cluster', value: 'redis', subtitle: 'In-memory Cache' },
            { label: 'MongoDB Atlas', value: 'mongo', subtitle: 'Document Store' },
        ],
    },
    {
        title: 'AI & Machine Learning',
        data: [
            { label: 'Gemini Interactions API', value: 'gemini', subtitle: 'Multimodal AI' },
            { label: 'OpenAI GPT-4o', value: 'openai', subtitle: 'Conversational LLM' },
            { label: 'Anthropic Claude 3.5', value: 'claude', subtitle: 'Reasoning Engine' },
        ],
    },
];

const TEAM_MEMBERS: DropdownItem<string>[] = [
    {
        label: 'Sarah Connor',
        value: 'sarah',
        subtitle: 'Engineering Lead',
        badge: 'Admin',
    },
    {
        label: 'Alex Rivera',
        value: 'alex',
        subtitle: 'Lead Product Designer',
        badge: 'Design',
    },
    {
        label: 'Kiran Patel',
        value: 'kiran',
        subtitle: 'Mobile Architect',
        badge: 'Lead',
    },
    {
        label: 'David Miller',
        value: 'david',
        subtitle: 'Security & DevOps',
        badge: 'DevOps',
    },
];

const FRAMEWORKS_SEARCH: DropdownItem<string>[] = [
    { label: 'React Native', value: 'rn', subtitle: 'Cross-platform mobile' },
    { label: 'Flutter', value: 'flutter', subtitle: 'Google UI toolkit' },
    { label: 'SwiftUI', value: 'swiftui', subtitle: 'Native Apple iOS' },
    { label: 'Jetpack Compose', value: 'compose', subtitle: 'Native Android Kotlin' },
    { label: 'Expo Framework', value: 'expo', subtitle: 'Universal React apps' },
];

type TabType = 'core' | 'multi' | 'rich' | 'custom';

const HomeScreenContent: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('core');

    // Dropdown States
    const [basicVal, setBasicVal] = useState<string | null>('aws');
    const [searchVal, setSearchVal] = useState<string | null>(null);
    const [bottomSheetVal, setBottomSheetVal] = useState<string | null>('pay');
    const [multiVals, setMultiVals] = useState<string[]>(['rn', 'ts']);
    const [checkboxVals, setCheckboxVals] = useState<string[]>(['push', 'email']);
    const [countryVal, setCountryVal] = useState<CountryData | null>(null);
    const [cascadingPath, setCascadingPath] = useState<CascadingItem<string>[]>([]);
    const [groupedVal, setGroupedVal] = useState<string | null>(null);
    const [customVal, setCustomVal] = useState<string | null>('sarah');
    const [autocompleteVal, setAutocompleteVal] = useState<string>('');
    const [universalVal, setUniversalVal] = useState<string | null>(null);

    const { keyboardHeight, isKeyboardVisible } = useKeyboard();
    const scrollViewRef = useRef<any>(null);
    const [sectionY, setSectionY] = useState(0);
    const [autoCardY, setAutoCardY] = useState(0);
    const [isAutocompleteFocused, setIsAutocompleteFocused] = useState(false);

    const scrollToAutocomplete = useCallback(() => {
        const targetScroll = Math.max(0, sectionY + autoCardY - 12);
        scrollViewRef.current?.scrollTo({
            y: targetScroll > 0 ? targetScroll : 360,
            animated: true,
        });
    }, [sectionY, autoCardY]);

    useEffect(() => {
        if (isKeyboardVisible && isAutocompleteFocused) {
            const timer = setTimeout(() => {
                scrollToAutocomplete();
            }, 80);
            return () => clearTimeout(timer);
        }
    }, [isKeyboardVisible, isAutocompleteFocused, scrollToAutocomplete]);

    const handleAutocompleteFocus = () => {
        setIsAutocompleteFocused(true);
        setTimeout(() => {
            scrollToAutocomplete();
        }, 100);
    };

    const handleAutocompleteBlur = () => {
        setIsAutocompleteFocused(false);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.keyboardAvoid}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={[
                        styles.scrollContent,
                        isKeyboardVisible
                            ? { paddingBottom: Math.max(keyboardHeight, 20) + 30 }
                            : styles.defaultPaddingBottom,
                    ]}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="interactive"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Dropdown UIKit</Text>
                        <Text style={styles.subtitle}>
                            Zero native dependencies • TypeScript first • iOS & Android
                        </Text>
                    </View>

                    {/* Tab Navigation (2x2 Grid) */}
                    <View style={styles.tabsGrid}>
                        <View style={styles.tabsRow}>
                            {[
                                { id: 'core', label: 'Core Select' },
                                { id: 'multi', label: 'Multi & Tags' },
                            ].map((tab) => (
                                <TouchableOpacity
                                    key={tab.id}
                                    style={[
                                        styles.tabPill,
                                        activeTab === tab.id && styles.tabPillActive,
                                    ]}
                                    onPress={() => setActiveTab(tab.id as TabType)}
                                >
                                    <Text
                                        style={[
                                            styles.tabPillText,
                                            activeTab === tab.id && styles.tabPillTextActive,
                                        ]}
                                    >
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.tabsRow}>
                            {[
                                { id: 'rich', label: 'Data & Drawer' },
                                { id: 'custom', label: 'Custom & AI' },
                            ].map((tab) => (
                                <TouchableOpacity
                                    key={tab.id}
                                    style={[
                                        styles.tabPill,
                                        activeTab === tab.id && styles.tabPillActive,
                                    ]}
                                    onPress={() => setActiveTab(tab.id as TabType)}
                                >
                                    <Text
                                        style={[
                                            styles.tabPillText,
                                            activeTab === tab.id && styles.tabPillTextActive,
                                        ]}
                                    >
                                        {tab.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* TAB 1: CORE SELECTIONS */}
                    {activeTab === 'core' && (
                        <View style={styles.cardsStack}>
                            {/* 1. BasicDropdown */}
                            <View style={styles.card}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Basic Dropdown</Text>
                                    <View style={styles.tagBadge}>
                                        <Text style={styles.tagBadgeText}>Single Select</Text>
                                    </View>
                                </View>
                                <BasicDropdown
                                    label="Cloud Infrastructure"
                                    required
                                    items={CLOUD_PROVIDERS}
                                    value={basicVal}
                                    onChange={(val) => setBasicVal(val)}
                                    presentation="popover"
                                    placeholder="Choose cloud provider"
                                    clearable
                                    loadingText="Fetching cloud providers..."
                                />
                            </View>

                            {/* 2. SearchableDropdown */}
                            <View style={styles.card}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Searchable Dropdown</Text>
                                    <View style={styles.tagBadge}>
                                        <Text style={styles.tagBadgeText}>Instant Search</Text>
                                    </View>
                                </View>
                                <SearchableDropdown
                                    label="Destination Airport"
                                    required
                                    items={AIRPORTS}
                                    value={searchVal}
                                    onChange={(val) => setSearchVal(val)}
                                    presentation="popover"
                                    placeholder="Select airport..."
                                    searchPlaceholder="Search airport name or code..."
                                    clearable
                                />
                            </View>

                            {/* 3. Universal Dropdown */}
                            <View style={styles.card}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Universal Dropdown Router</Text>
                                    <View style={[styles.tagBadge, styles.tagBadgeHighlight]}>
                                        <Text style={styles.tagBadgeHighlightText}>Universal</Text>
                                    </View>
                                </View>
                                <Dropdown
                                    mode="basic"
                                    label="Select Framework"
                                    items={FRAMEWORKS_SEARCH}
                                    value={universalVal}
                                    onChange={(val) => setUniversalVal(val)}
                                    presentation="popover"
                                    placeholder="Choose framework"
                                    clearable
                                />
                            </View>
                        </View>
                    )}

                    {/* TAB 2: MULTI-SELECT & TAGS */}
                    {activeTab === 'multi' && (
                        <View style={styles.cardsStack}>
                            {/* 4. MultiSelectDropdown */}
                            <View style={styles.card}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Multi-Select Dropdown</Text>
                                    <View style={styles.tagBadge}>
                                        <Text style={styles.tagBadgeText}>Chips & Tags</Text>
                                    </View>
                                </View>
                                <MultiSelectDropdown
                                    label="Required Tech Skills"
                                    items={TECH_STACK}
                                    values={multiVals}
                                    onChange={(vals) => setMultiVals(vals)}
                                    presentation="popover"
                                    maxSelect={4}
                                    maxDisplayChips={2}
                                    placeholder="Select technologies (up to 4)"
                                    searchPlaceholder="Filter technologies..."
                                    searchable
                                />
                            </View>

                            {/* 5. CheckboxDropdown */}
                            <View style={styles.card}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Checkbox Dropdown</Text>
                                    <View style={styles.tagBadge}>
                                        <Text style={styles.tagBadgeText}>Select All</Text>
                                    </View>
                                </View>
                                <CheckboxDropdown
                                    label="Notification Preferences"
                                    items={NOTIFICATIONS}
                                    values={checkboxVals}
                                    onChange={(vals) => setCheckboxVals(vals)}
                                    presentation="popover"
                                    placeholder="Configure notification channels"
                                    searchPlaceholder="Search channels..."
                                    showSelectAll
                                    selectAllLabel="Enable All"
                                    deselectAllLabel="Disable All"
                                />
                            </View>
                        </View>
                    )}

                    {/* TAB 3: RICH DATA & DRAWER */}
                    {activeTab === 'rich' && (
                        <View style={styles.cardsStack}>
                            {/* 6. CountryDropdown */}
                            <View style={styles.card}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Country Picker</Text>
                                    <View style={styles.tagBadge}>
                                        <Text style={styles.tagBadgeText}>~250 Countries</Text>
                                    </View>
                                </View>
                                <CountryDropdown
                                    label="Country of Residence"
                                    required
                                    value={countryVal}
                                    onChange={(c) => setCountryVal(c)}
                                    presentation="popover"
                                    placeholder="Select your country..."
                                    searchPlaceholder="Search country or code (+1, IN)..."
                                    showFlag
                                    showDialCode
                                />
                            </View>

                            {/* 7. BottomSheetDropdown */}
                            <View style={styles.card}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Bottom Sheet Drawer</Text>
                                    <View style={styles.tagBadge}>
                                        <Text style={styles.tagBadgeText}>Slide Up</Text>
                                    </View>
                                </View>
                                <BottomSheetDropdown
                                    label="Payment Method"
                                    required
                                    items={PAYMENT_METHODS}
                                    value={bottomSheetVal}
                                    onChange={(val) => setBottomSheetVal(val)}
                                    placeholder="Choose payment method"
                                    modalTitle="Select Payment Method"
                                    searchable
                                />
                            </View>

                            {/* 8. CascadingDropdown */}
                            <View style={styles.card}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Cascading Hierarchical</Text>
                                    <View style={styles.tagBadge}>
                                        <Text style={styles.tagBadgeText}>Drilldown</Text>
                                    </View>
                                </View>
                                <CascadingDropdown
                                    label="Geographic Location"
                                    data={SAMPLE_CASCADING_DATA}
                                    value={cascadingPath.map((i) => i.value)}
                                    onChange={(path) => setCascadingPath(path)}
                                    presentation="modal"
                                    placeholder="Select location hierarchy..."
                                    separator=" ➔ "
                                />
                            </View>

                            {/* 9. GroupedDropdown */}
                            <View style={styles.card}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Grouped Categories</Text>
                                    <View style={styles.tagBadge}>
                                        <Text style={styles.tagBadgeText}>Sticky Headers</Text>
                                    </View>
                                </View>
                                <GroupedDropdown
                                    label="Technology Services"
                                    groups={GROUPED_SERVICES}
                                    value={groupedVal}
                                    onChange={(val) => setGroupedVal(val)}
                                    presentation="modal"
                                    placeholder="Select service..."
                                    searchPlaceholder="Search in categories..."
                                    stickySectionHeaders
                                    searchable
                                />
                            </View>
                        </View>
                    )}

                    {/* TAB 4: CUSTOM SLOTS & AUTOCOMPLETE */}
                    {activeTab === 'custom' && (
                        <View
                            style={styles.cardsStack}
                            onLayout={(e) => setSectionY(e.nativeEvent.layout.y)}
                        >
                            {/* 10. CustomDropdown */}
                            <View style={styles.card}>
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Custom Slot Dropdown</Text>
                                    <View style={styles.tagBadge}>
                                        <Text style={styles.tagBadgeText}>Avatars & Badges</Text>
                                    </View>
                                </View>
                                <CustomDropdown
                                    label="Assign Project Lead"
                                    items={TEAM_MEMBERS}
                                    value={customVal}
                                    onChange={(val) => setCustomVal(val)}
                                    presentation="popover"
                                    placeholder="Choose team member"
                                    clearable
                                    renderItem={(item, isSelected) => (
                                        <View
                                            style={[
                                                styles.customRow,
                                                isSelected && styles.customRowActive,
                                            ]}
                                        >
                                            <View style={styles.avatarCircle}>
                                                <Text style={styles.avatarLetter}>
                                                    {item.label.charAt(0)}
                                                </Text>
                                            </View>
                                            <View style={styles.customInfoCol}>
                                                <Text style={styles.customName}>{item.label}</Text>
                                                <Text style={styles.customSubtitle}>{item.subtitle}</Text>
                                            </View>
                                            {item.badge ? (
                                                <View style={styles.roleTag}>
                                                    <Text style={styles.roleTagText}>{item.badge}</Text>
                                                </View>
                                            ) : null}
                                        </View>
                                    )}
                                />
                            </View>

                            {/* 11. AutocompleteDropdown */}
                            <View
                                style={styles.card}
                                onLayout={(e) => setAutoCardY(e.nativeEvent.layout.y)}
                            >
                                <View style={styles.cardHeaderRow}>
                                    <Text style={styles.cardTitle}>Autocomplete Dropdown</Text>
                                    <View style={styles.tagBadge}>
                                        <Text style={styles.tagBadgeText}>Inline Typing</Text>
                                    </View>
                                </View>
                                <AutocompleteDropdown
                                    label="Search Framework or UI Kit"
                                    items={FRAMEWORKS_SEARCH}
                                    value={autocompleteVal}
                                    onTextChange={setAutocompleteVal}
                                    onSelect={(item) => setAutocompleteVal(item.label)}
                                    placeholder="Type framework (e.g. React Native)..."
                                    placement="auto"
                                    onFocus={handleAutocompleteFocus}
                                    onBlur={handleAutocompleteBlur}
                                />
                            </View>
                        </View>
                    )}

                    <View style={styles.footer}>
                        <Text style={styles.footerBrand}>react-native-dropdown-uikit</Text>
                        <Text style={styles.footerSub}>Official UI Kit Showcase • Production Ready</Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default function HomeScreen() {
    return (
        <ThemeProvider mode="auto">
            <HomeScreenContent />
        </ThemeProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    defaultPaddingBottom: {
        paddingBottom: 40,
    },
    header: {
        marginBottom: 18,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
        lineHeight: 18,
    },
    tabsGrid: {
        gap: 8,
        marginBottom: 16,
    },
    tabsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    tabPill: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    tabPillActive: {
        backgroundColor: '#4F46E5',
        borderColor: '#4F46E5',
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    tabPillText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    tabPillTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    cardsStack: {
        gap: 14,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    tagBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    tagBadgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#475569',
    },
    tagBadgeHighlight: {
        backgroundColor: '#EEF2FF',
    },
    tagBadgeHighlightText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#4F46E5',
    },
    customRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#F1F5F9',
    },
    customRowActive: {
        backgroundColor: '#EEF2FF',
    },
    avatarCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4F46E5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarLetter: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    customInfoCol: {
        flex: 1,
    },
    customName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
    },
    customSubtitle: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },
    roleTag: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    roleTagText: {
        fontSize: 11,
        color: '#475569',
        fontWeight: '600',
    },
    footer: {
        marginTop: 28,
        marginBottom: 16,
        alignItems: 'center',
    },
    footerBrand: {
        fontSize: 13,
        fontWeight: '700',
        color: '#475569',
    },
    footerSub: {
        fontSize: 11,
        color: '#94A3B8',
        marginTop: 3,
    },
});
