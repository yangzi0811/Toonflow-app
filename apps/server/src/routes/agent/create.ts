import { Router } from "express";
import { z } from "zod";
import u from "@/utils";
import { validateFields } from "@/lib/middleware";
import { success } from "@/lib/responseFormat";
import { thinkingLevels, type ThinkingLevel } from "@/lib/modelReasoning";

export default Router().post("/", validateFields({
  directory: z.string().min(1).max(4096),
  providerId: z.string().min(1).max(256).optional(),
  modelId: z.string().min(1).max(256).optional(),
  thinkingLevel: z.enum(thinkingLevels).optional(),
}), async (req, res) => {
  const { directory, providerId, modelId, thinkingLevel } = req.body as {
    directory: string; providerId?: string; modelId?: string; thinkingLevel?: ThinkingLevel;
  };
  const cwd = await u.workspace.resolveWorkspace(req, directory);
  const model = providerId && modelId ? { providerId, modelId, thinkingLevel } : undefined;
  res.json(success(await u.agent.createAgentConversation(cwd, undefined, model)));
});
