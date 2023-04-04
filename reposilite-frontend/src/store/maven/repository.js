/*
 * Copyright (c) 2023 dzikoysk
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { computed } from "vue"
import usePlaceholders from "../../store/placeholders"

export default function useRepository() {
  const { basePath, id, title } = usePlaceholders()

  const createRepositories = (qualifier) => {
    const repository = computed(() => qualifier.path.split("/")[0])
    const repoId = id + (qualifier.path ? `-${repository.value}` : "")
    const domain =
      location.protocol +
      "//" +
      location.host +
      basePath +
      (basePath.endsWith("/") ? "" : "/") +
      (qualifier.path ? `${repository.value}` : "{repository}")

    return { type: "repository", repoId, title, domain }
  }

  const createRepositorySnippet = (name, { repoId, title, domain }) => {
    switch (name) {
      case "bld": return `repository("${domain}")`
      case "bld Extension": return `${domain}`
      case "Maven": return `
<repository>
  <id>${repoId}</id>
  <name>${title}</name>
  <url>${domain}</url>
</repository>`.trim()
      case "Gradle Groovy": return `maven {\n    url "${domain}"\n}`
      case "Gradle Kotlin": return `maven {\n    url = uri("${domain}")\n}`
      case "SBT": return `resolvers +=\n  "${repoId}" \n     at "${domain}"`
      default: return ""
    }
  }


  return {
    createRepositories,
    createRepositorySnippet
  }
}
