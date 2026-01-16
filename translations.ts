import { Language } from './types';

export const ART_STYLES = [
  { id: "shonen", label: { en: "Shonen Manga (High Contrast, Action)", zh: "少年漫画 (高对比度，动作感)" } },
  { id: "shojo", label: { en: "Shojo Manga (Soft, Emotional, Detailed Eyes)", zh: "少女漫画 (柔和，情感，细腻眼部)" } },
  { id: "seinen", label: { en: "Seinen Manga (Gritty, Realistic, Detailed Backgrounds)", zh: "青年漫画 (写实，硬朗，背景细腻)" } },
  { id: "webtoon", label: { en: "Webtoon Style (Full Color, Clean Lines)", zh: "条漫风格 (全彩，线条干净)" } },
  { id: "american", label: { en: "American Comic (Bold Ink, Vibrant Color)", zh: "美式漫画 (大胆墨线，色彩鲜艳)" } },
  { id: "cyberpunk", label: { en: "Cyberpunk Anime (Neon, Dark, Tech-heavy)", zh: "赛博朋克动画 (霓虹，暗黑，科技感)" } }
];

export const translations = {
  en: {
    title: "MangaMind AI",
    nav: {
      setup: "Story Setup",
      editor: "Visual Editor",
      export: "Export",
    },
    setup: {
      heading: "Create Your Comic",
      subheading: "Describe your story idea, and let AI generate the script and panel breakdown for you.",
      conceptLabel: "Story Concept / Plot",
      conceptPlaceholder: "e.g. A cyberpunk samurai searching for his lost cat in a neon-lit futuristic Tokyo...",
      styleLabel: "Art Style",
      panelsLabel: "Initial Panels",
      generateBtn: "GENERATE STORY",
      generatingBtn: "WRITING SCRIPT...",
    },
    editor: {
      addPanel: "Add Panel",
      endScene: "End of Scene",
      panelsCount: "Panels",
    },
    panel: {
      visualLabel: "Visual Prompt (AI Instruction)",
      visualPlaceholder: "Describe the scene visuals...",
      dialogueLabel: "Dialogue / Text",
      dialoguePlaceholder: "Character speech...",
      regenerate: "Regenerate",
      generate: "Generate Art",
      drawing: "Drawing Panel...",
      noImage: "No Image Generated",
      focusPrefix: "Focus: "
    }
  },
  zh: {
    title: "漫心 AI (MangaMind)",
    nav: {
      setup: "故事设定",
      editor: "视觉编辑器",
      export: "导出",
    },
    setup: {
      heading: "创作你的漫画",
      subheading: "描述你的故事创意，让 AI 为你生成剧本和分镜。",
      conceptLabel: "故事概念 / 情节",
      conceptPlaceholder: "例如：一个赛博朋克武士在霓虹闪烁的未来东京寻找他走失的猫……",
      styleLabel: "艺术风格",
      panelsLabel: "初始分镜数量",
      generateBtn: "生成故事",
      generatingBtn: "正在编写剧本...",
    },
    editor: {
      addPanel: "添加分镜",
      endScene: "场景结束",
      panelsCount: "分镜",
    },
    panel: {
      visualLabel: "画面提示词 (AI 指令)",
      visualPlaceholder: "描述场景视觉效果...",
      dialogueLabel: "对白 / 文字",
      dialoguePlaceholder: "角色台词...",
      regenerate: "重新生成",
      generate: "生成画面",
      drawing: "正在绘制...",
      noImage: "尚未生成图片",
      focusPrefix: "焦点："
    }
  }
};