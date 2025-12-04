export type Locale = 'en' | 'ar'
export type Direction = 'ltr' | 'rtl'

export const dictionaries = {
    en: {
        common: {
            appName: "Prompt Library",
            explore: "Explore",
            library: "Library",
            signIn: "Sign In",
            signUp: "Sign Up",
            signOut: "Sign Out",
            search: "Search prompts...",
            loading: "Loading...",
            error: "An error occurred",
            save: "Save",
            cancel: "Cancel",
            edit: "Edit",
            delete: "Delete",
            create: "Create",
            update: "Update",
            copy: "Copy",
            copied: "Copied!",
            actions: "Actions",
            allCategories: "All Categories",
            reset: "Reset",
            viewDetails: "View Details",
            categories: "Categories",
            home: "Home",
            filters: "Filters",
            keywords: "Keywords...",
            searchPlaceholder: "Search by topic...",
            prev: "Prev",
            next: "Next",
            hideFilters: "Hide Filters",
            showFilters: "Show Filters",
            clearFilters: "Clear filters",
            terms: "Terms of Service",
            privacy: "Privacy Policy",
            contact: "Contact Us",
            copyright: "© 2025 Prompt Library. All rights reserved.",
            quickLinks: "Quick Links",
            legal: "Legal",
        },
        categories: {
            artDesign: "Art & Design",
            business: "Business",
            coding: "Coding",
            creativeWriting: "Creative Writing",
            education: "Education",
            productivity: "Productivity",
        },
        home: {
            heroTitle: "Discover & Share AI Prompts",
            heroSubtitle: "The best place to find, create, and organize prompts for ChatGPT, Claude, Midjourney, and more.",
            getStarted: "Get Started",
            learnMore: "Learn More",
            features: {
                title: "Why Prompt Library?",
                share: {
                    title: "Share with Community",
                    desc: "Share your best prompts and help others unlock the power of AI."
                },
                organize: {
                    title: "Organize Your Collection",
                    desc: "Save your favorite prompts and organize them into collections."
                },
                discover: {
                    title: "Discover New Ideas",
                    desc: "Browse thousands of prompts created by the community."
                }
            }
        },
        auth: {
            welcomeBack: "Welcome Back!",
            signInSubtitle: "Sign in to continue to Prompt Library",
            joinUs: "Join Us!",
            signUpSubtitle: "Create your account to start exploring",
            email: "Email Address",
            password: "Password",
            name: "Full Name",
            forgotPassword: "Forgot password?",
            orContinueWith: "Or continue with",
            dontHaveAccount: "Don't have an account?",
            alreadyHaveAccount: "Already have an account?",
            createAccount: "Create Account",
            signingIn: "Signing in...",
            creatingAccount: "Creating account...",
            passwordMinLength: "Must be at least 6 characters long",
        },
        prompt: {
            new: "Create New Prompt",
            newSubtitle: "Share your best prompts with the community.",
            title: "Title",
            category: "Category",
            selectCategory: "Select a category",
            description: "Description",
            content: "Prompt Content",
            isPublic: "Make this prompt public",
            createdBy: "Created by",
            ratings: "Ratings",
            favorites: "Favorites",
            views: "Views",
            copies: "Copies",
            similarPrompts: "Similar Prompts",
            viewAll: "View All",
            noPrompts: "No prompts found.",
            beFirst: "Be the first to create one!",
            notFound: "Prompt not found",
            private: "This prompt is private",
        },
        library: {
            title: "My Library",
            tabs: {
                myPrompts: "My Prompts",
                favorites: "Favorites",
                collections: "Collections",
            },
            emptyPrompts: "You haven't created any prompts yet.",
            emptyFavorites: "You haven't favorited any prompts yet.",
            emptyCollections: "You haven't created any collections yet.",
        },
        terms: {
            lastUpdated: "Last updated: December 1, 2025",
            introduction: {
                title: "1. Introduction",
                content: "Welcome to Prompt Library. By accessing our website, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws."
            },
            useLicense: {
                title: "2. Use License",
                content: "Permission is granted to temporarily download one copy of the materials (information or software) on Prompt Library's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
                items: [
                    "modify or copy the materials;",
                    "use the materials for any commercial purpose, or for any public display (commercial or non-commercial);",
                    "attempt to decompile or reverse engineer any software contained on Prompt Library's website;",
                    "remove any copyright or other proprietary notations from the materials; or",
                    "transfer the materials to another person or \"mirror\" the materials on any other server."
                ]
            },
            disclaimer: {
                title: "3. Disclaimer",
                content: "The materials on Prompt Library's website are provided on an 'as is' basis. Prompt Library makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights."
            },
            limitations: {
                title: "4. Limitations",
                content: "In no event shall Prompt Library or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Prompt Library's website, even if Prompt Library or a Prompt Library authorized representative has been notified orally or in writing of the possibility of such damage."
            }
        },
        privacy: {
            lastUpdated: "Last updated: December 1, 2025",
            infoCollect: {
                title: "1. Information We Collect",
                content: "We collect information you provide directly to us, such as when you create an account, create a prompt, or communicate with us. This information may include your name, email address, and any other information you choose to provide."
            },
            howWeUse: {
                title: "2. How We Use Your Information",
                content: "We use the information we collect to provide, maintain, and improve our services, such as to:",
                items: [
                    "Create and maintain your account;",
                    "Process your transactions;",
                    "Send you technical notices, updates, security alerts, and support and administrative messages;",
                    "Respond to your comments, questions, and requests;",
                    "Communicate with you about products, services, offers, and events offered by Prompt Library."
                ]
            },
            sharing: {
                title: "3. Sharing of Information",
                content: "We do not share your personal information with third parties except as described in this privacy policy. We may share your information with third-party vendors, consultants, and other service providers who need access to such information to carry out work on our behalf."
            },
            security: {
                title: "4. Security",
                content: "We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction."
            }
        },
        contact: {
            subtitle: "Have questions or feedback? We'd love to hear from you.",
            message: "Message",
            messagePlaceholder: "How can we help you?",
            namePlaceholder: "Your Name",
            emailPlaceholder: "you@example.com",
            sendMessage: "Send Message"
        }
    },
    ar: {
        common: {
            appName: "مكتبة البرومبت",
            explore: "استكشف",
            library: "مكتبتي",
            signIn: "تسجيل الدخول",
            signUp: "إنشاء حساب",
            signOut: "تسجيل الخروج",
            search: "ابحث عن برومبت...",
            loading: "جاري التحميل...",
            error: "حدث خطأ ما",
            save: "حفظ",
            cancel: "إلغاء",
            edit: "تعديل",
            delete: "حذف",
            create: "إنشاء",
            update: "تحديث",
            copy: "نسخ",
            copied: "تم النسخ!",
            actions: "إجراءات",
            allCategories: "كل التصنيفات",
            reset: "إعادة تعيين",
            viewDetails: "عرض التفاصيل",
            categories: "التصنيفات",
            home: "الرئيسية",
            filters: "الفلاتر",
            keywords: "الكلمات المفتاحية...",
            searchPlaceholder: "ابحث عن موضوعك...",
            prev: "السابق",
            next: "التالي",
            hideFilters: "إخفاء الفلاتر",
            showFilters: "إظهار الفلاتر",
            clearFilters: "مسح الفلاتر",
            terms: "شروط الخدمة",
            privacy: "سياسة الخصوصية",
            contact: "اتصل بنا",
            copyright: "© 2025 مكتبة البرومبت. جميع الحقوق محفوظة.",
            quickLinks: "روابط سريعة",
            legal: "قانوني",
        },
        categories: {
            artDesign: "الفن والتصميم",
            business: "الأعمال",
            coding: "البرمجة",
            creativeWriting: "الكتابة الإبداعية",
            education: "التعليم",
            productivity: "الإنتاجية",
        },
        home: {
            heroTitle: "اكتشف وشارك أوامر الذكاء الاصطناعي",
            heroSubtitle: "أفضل مكان للعثور على، إنشاء، وتنظيم الأوامر لـ ChatGPT و Claude و Midjourney والمزيد.",
            getStarted: "ابدأ الآن",
            learnMore: "المزيد",
            features: {
                title: "لماذا مكتبة البرومبت؟",
                share: {
                    title: "شارك مع المجتمع",
                    desc: "شارك أفضل الأوامر لديك وساعد الآخرين على الاستفادة من قوة الذكاء الاصطناعي."
                },
                organize: {
                    title: "نظم مجموعتك",
                    desc: "احفظ الأوامر المفضلة لديك ونظمها في مجموعات."
                },
                discover: {
                    title: "اكتشف أفكاراً جديدة",
                    desc: "تصفح آلاف الأوامر التي أنشأها المجتمع."
                }
            }
        },
        auth: {
            welcomeBack: "أهلاً بعودتك!",
            signInSubtitle: "سجل الدخول للمتابعة إلى مكتبة البرومبت",
            joinUs: "انضم إلينا!",
            signUpSubtitle: "أنشئ حسابك لتبدأ الاستكشاف",
            email: "البريد الإلكتروني",
            password: "كلمة المرور",
            name: "الاسم الكامل",
            forgotPassword: "نسيت كلمة المرور؟",
            orContinueWith: "أو تابع باستخدام",
            dontHaveAccount: "ليس لديك حساب؟",
            alreadyHaveAccount: "لديك حساب بالفعل؟",
            createAccount: "إنشاء حساب",
            signingIn: "جاري تسجيل الدخول...",
            creatingAccount: "جاري إنشاء الحساب...",
            passwordMinLength: "يجب أن تكون 6 أحرف على الأقل",
        },
        prompt: {
            new: "إنشاء برومبت جديد",
            newSubtitle: "شارك أفضل الأوامر لديك مع المجتمع.",
            title: "العنوان",
            category: "التصنيف",
            selectCategory: "اختر تصنيفاً",
            description: "الوصف",
            content: "محتوى البرومبت",
            isPublic: "اجعل هذا البرومبت عاماً",
            createdBy: "بواسطة",
            ratings: "التقييمات",
            favorites: "المفضلة",
            views: "المشاهدات",
            copies: "النسخ",
            similarPrompts: "برومتات مشابهة",
            viewAll: "عرض الكل",
            noPrompts: "لم يتم العثور على أي برومبت.",
            beFirst: "كن أول من ينشئ واحداً!",
            notFound: "البرومبت غير موجود",
            private: "هذا البرومبت خاص",
        },
        library: {
            title: "مكتبتي",
            tabs: {
                myPrompts: "أوامري",
                favorites: "المفضلة",
                collections: "المجموعات",
            },
            emptyPrompts: "لم تقم بإنشاء أي برومبت بعد.",
            emptyFavorites: "لم تقم بإضافة أي برومبت للمفضلة بعد.",
            emptyCollections: "لم تقم بإنشاء أي مجموعات بعد.",
        },
        terms: {
            lastUpdated: "آخر تحديث: 1 ديسمبر 2025",
            introduction: {
                title: "1. المقدمة",
                content: "مرحباً بك في مكتبة البرومبت. من خلال الوصول إلى موقعنا، فإنك توافق على الالتزام بشروط الخدمة هذه، وجميع القوانين واللوائح المعمول بها، وتوافق على أنك مسؤول عن الامتثال لأي قوانين محلية سارية."
            },
            useLicense: {
                title: "2. ترخيص الاستخدام",
                content: "يُمنح الإذن بتنزيل نسخة واحدة مؤقتة من المواد (المعلومات أو البرامج) على موقع مكتبة البرومبت للعرض الشخصي غير التجاري المؤقت فقط. هذا منح ترخيص، وليس نقل ملكية، وبموجب هذا الترخيص لا يجوز لك:",
                items: [
                    "تعديل أو نسخ المواد؛",
                    "استخدام المواد لأي غرض تجاري، أو لأي عرض عام (تجاري أو غير تجاري)؛",
                    "محاولة فك تجميع أو إجراء هندسة عكسية لأي برنامج موجود على موقع مكتبة البرومبت؛",
                    "إزالة أي حقوق نشر أو إشعارات ملكية أخرى من المواد؛ أو",
                    "نقل المواد إلى شخص آخر أو \"نسخ\" المواد على أي خادم آخر."
                ]
            },
            disclaimer: {
                title: "3. إخلاء المسؤولية",
                content: "يتم توفير المواد على موقع مكتبة البرومبت \"كما هي\". لا تقدم مكتبة البرومبت أي ضمانات، صريحة أو ضمنية، وتخلي مسؤوليتها بموجب هذا وتنفي جميع الضمانات الأخرى بما في ذلك، على سبيل المثال لا الحصر، الضمانات الضمنية أو شروط القابلية للتسويق، أو الملاءمة لغرض معين، أو عدم انتهاك الملكية الفكرية أو أي انتهاك آخر للحقوق."
            },
            limitations: {
                title: "4. القيود",
                content: "لن تكون مكتبة البرومبت أو مورديها مسؤولين في أي حال من الأحوال عن أي أضرار (بما في ذلك، على سبيل المثال لا الحصر، الأضرار الناجمة عن فقدان البيانات أو الربح، أو بسبب انقطاع الأعمال) الناشئة عن استخدام أو عدم القدرة على استخدام المواد على موقع مكتبة البرومبت، حتى لو تم إخطار مكتبة البرومبت أو ممثل معتمد لمكتبة البرومبت شفهياً أو كتابياً بإمكانية حدوث مثل هذا الضرر."
            }
        },
        privacy: {
            lastUpdated: "آخر تحديث: 1 ديسمبر 2025",
            infoCollect: {
                title: "1. المعلومات التي نجمعها",
                content: "نقوم بجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب، أو إنشاء برومبت، أو التواصل معنا. قد تتضمن هذه المعلومات اسمك وعنوان بريدك الإلكتروني وأي معلومات أخرى تختار تقديمها."
            },
            howWeUse: {
                title: "2. كيف نستخدم معلوماتك",
                content: "نستخدم المعلومات التي نجمعها لتوفير خدماتنا وصيانتها وتحسينها، مثل:",
                items: [
                    "إنشاء حسابك وصيانته؛",
                    "معالجة معاملاتك؛",
                    "إرسال إشعارات فنية وتحديثات وتنبيهات أمنية ورسائل دعم وإدارية؛",
                    "الرد على تعليقاتك وأسئلتك وطلباتك؛",
                    "التواصل معك حول المنتجات والخدمات والعروض والأحداث التي تقدمها مكتبة البرومبت."
                ]
            },
            sharing: {
                title: "3. مشاركة المعلومات",
                content: "لا نشارك معلوماتك الشخصية مع أطراف ثالثة إلا كما هو موضح في سياسة الخصوصية هذه. قد نشارك معلوماتك مع بائعين خارجيين ومستشارين ومقدمي خدمات آخرين يحتاجون إلى الوصول إلى هذه المعلومات للقيام بالعمل نيابة عنا."
            },
            security: {
                title: "4. الأمان",
                content: "نتخذ تدابير معقولة للمساعدة في حماية المعلومات المتعلقة بك من الفقدان والسرقة وسوء الاستخدام والوصول غير المصرح به والإفصاح والتعديل والتدمير."
            }
        },
        contact: {
            subtitle: "هل لديك أسئلة أو ملاحظات؟ نحن نحب أن نسمع منك.",
            message: "الرسالة",
            messagePlaceholder: "كيف يمكننا مساعدتك؟",
            namePlaceholder: "اسمك",
            emailPlaceholder: "you@example.com",
            sendMessage: "إرسال الرسالة"
        }
    }
}
