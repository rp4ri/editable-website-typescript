export interface HomeData {
	title?: string;
	faqs?: string;
	testimonials?: TestimonialData[];
	introStep1?: IntroStepData;
	introStep2?: IntroStepData;
	introStep3?: IntroStepData;
	introStep4?: IntroStepData;
	bioPicture?: string;
	bioTitle?: string;
	bio?: string;
}

export interface IntroStepData {
	label: string;
	title: string;
	description: string;
}

export interface TestimonialData {
	text: string;
	image: string;
	name: string;
}

export interface Article {
	// Define properties based on your actual Article structure
	title: string;
	content: string;
	// Add other properties as needed
}
