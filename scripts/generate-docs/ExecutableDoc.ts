import {
  Language,
  Beautifier,
  ExecutableDependencyDefinition,
  Badge,
} from "unibeautify";
import * as _ from "lodash";
import Doc from "./Doc";
import MarkdownBuilder from "./MarkdownBuilder";
import { slugify, websiteEditUrl } from "./utils";

export default class ExecutableDoc extends Doc {
  constructor(
    private executable: ExecutableDependencyDefinition,
    private beautifier: Beautifier,
    private languages: Language[]
  ) {
    super();
  }
  public get prefix(): string {
    return "executable-";
  }
  public get id(): string {
    return `${this.prefix}${this.slug}`;
  }
  public get title(): string {
    return `${this.executable.name} Executable`;
  }
  protected get description() {
    return undefined;
  }
  protected get slug(): string {
    return slugify(`${this.beautifier.name}-${this.executable.name}`);
  }
  public get beautifierName(): string {
    return this.beautifier.name;
  }
  private get dependencyName(): string {
    return this.executable.name;
  }
  protected get sidebarLabel(): string {
    return `${this.executable.name} Executable`;
  }
  protected get body(): string {
    const builder = new MarkdownBuilder();
    builder.appendBadges(this.badges);
    this.appendAboutSection(builder);
    this.appendInstallSection(builder);
    this.appendConfigSection(builder);
    this.appendTroubleshootingSection(builder);
    return builder.build();
  }

  private appendAboutSection(builder: MarkdownBuilder): MarkdownBuilder {
    const dependency = this.executable;
    const beautifierName: string = this.beautifier.name;
    const dependencyName: string = dependency.name;
    builder.editButton(
      `Edit ${this.beautifierName} Beautifier`,
      this.beautifierHomepageUrl
    );
    builder.header(`About`, 2);
    const isConfusing =
      beautifierName.toLowerCase() === dependencyName.toLowerCase();
    builder.append(
      `${dependencyName} executable is a third-party program you must install manually and is required for beautification.`
    );
    if (this.executableHomepageUrl) {
      builder.append(
        `See ${MarkdownBuilder.createLink(
          this.executableHomepageUrl,
          this.executableHomepageUrl
        )} for more information.`
      );
    }
    if (isConfusing) {
      builder.append(
        `> **${dependencyName} executable** should not be confused with **${beautifierName} beautifier** with the same name.`
      );
    }
    return builder;
  }

  private appendInstallSection(builder: MarkdownBuilder): MarkdownBuilder {
    if (this.installationUrl) {
      builder.header(`Install`, 2);
      builder.append(
        `Install ${this.executable.name} (\`${
          this.executable.program
        }\`) by following ${MarkdownBuilder.createLink(
          this.installationUrl,
          this.installationUrl
        )}.`
      );
      if (this.bugsUrl) {
        builder.append(
          `If you have questions or want to report a bug, go to ${MarkdownBuilder.createLink(
            this.bugsUrl,
            this.bugsUrl
          )}.`
        );
      }
    }
    return builder;
  }

  public appendTroubleshootingSection(
    builder: MarkdownBuilder
  ): MarkdownBuilder {
    builder.header(`Troubleshooting`, 2);
    builder.append("");
    builder.append(
      "Below are instructions for each of the supported Operating Systems."
    );
    this.appendWindowsSection(builder);
    this.appendMacSection(builder);
    this.appendLinuxSection(builder);

    return builder;
  }

  private appendWindowsSection(builder: MarkdownBuilder): MarkdownBuilder {
    builder.header("Windows", 3);
    builder.append(
      "[Open the Command Prompt](https://www.lifewire.com/how-to-open-command-prompt-" +
        "2618089)."
    );
    builder.details("Show me how to open the Command Prompt.", builder => {
      builder.append(
        "\n<p><iframe width='560' height='315' src='https://www.youtube.com/embed/MBBWV" +
          "gE0ewk' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></if" +
          "rame></p>\n"
      );
    });
    builder.append("");
    const dependency = this.executable;
    builder.append(
      `Find the path to ${this.dependencyName} by running the command:`
    );
    builder.code(`where ${dependency.program}`, "batch");
    builder.append(
      "Which will return an absolute path like one of the following:"
    );
    const suffixes = ["", ".exe", ".bat"];
    builder.code(
      suffixes
        .map(suffix => `C:\\absolute\\path\\to\\${dependency.program}${suffix}`)
        .join("\n"),
      "text"
    );
    builder.append(
      "If `where` fails to return an executable path then you need to fix your `PATH`" +
        " Environment Variable."
    );
    builder.details(
      "Show me how to change my `PATH` environment variable.",
      builder => {
        builder.append(
          "\n<iframe width='560' height='315' src='https://www.youtube.com/embed/8HK1BsRp" +
            "rt0?start=334' frameborder='0' allow='autoplay; encrypted-media' allowfullscre" +
            "en></iframe>\n"
        );
      }
    );
    builder.append("");
    builder.append(
      `If you know the executable path go to the ${MarkdownBuilder.createLink(
        "Configure",
        "#configure"
      )} section and replace \`${fakePathForProgram(
        dependency.program
      )}\` with your specific executable path value.`
    );
    return builder;
  }

  private appendMacSection(builder: MarkdownBuilder): MarkdownBuilder {
    builder.header("macOS", 3);
    const dependency = this.executable;
    builder.append("Open the Terminal application.");
    builder.details("Show me how to open the Terminal.", builder => {
      builder.append(
        "\n<iframe width='560' height='315' src='https://www.youtube.com/embed/zw7Nd67_" +
          "aFw' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></ifram" +
          "e>\n"
      );
    });
    builder.append(
      `\nFind the path to ${this.dependencyName} by running the command:`
    );
    builder.code(`which ${dependency.program}`, "bash");
    builder.append(
      "Which will return an absolute path like one of the following:"
    );
    const suffixes = ["", ".sh", ".bash"];
    builder.code(
      suffixes
        .map(suffix => fakePathForProgram(`${dependency.program}${suffix}`))
        .join("\n"),
      "text"
    );
    builder.append(
      "If `which` fails to return an executable path then you need to fix your `PATH`" +
        " Environment Variable:"
    );
    builder.details(
      "Show me how to change my `PATH` environment variable.",
      builder => {
        builder.append(
          "\n<iframe width='560' height='315' src='https://www.youtube.com/embed/aYVEZTmB" +
            "iuc' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></ifram" +
            "e>\n"
        );
      }
    );
    builder.append("");
    builder.append(
      `If you know the executable path go to the ${MarkdownBuilder.createLink(
        "Configure",
        "#configure"
      )} section and replace \`${fakePathForProgram(
        dependency.program
      )}\` with your specific executable path value.`
    );
    return builder;
  }

  private appendLinuxSection(builder: MarkdownBuilder): MarkdownBuilder {
    builder.header("Linux", 3);
    const dependency = this.executable;
    builder.append("Open the Terminal application.");
    builder.details("Show me how to open the Terminal.", builder => {
      builder.append(
        "\n<iframe width='560' height='315' src='https://www.youtube.com/embed/AO0jzD1h" +
          "pXc?start=28' frameborder='0' allow='autoplay; encrypted-media' allowfullscree" +
          "n></iframe>\n"
      );
    });
    builder.append(
      `\nFind the path to ${this.dependencyName} by running the command:`
    );
    builder.code(`which ${dependency.program}`, "bash");
    builder.append(
      "Which will return an absolute path like one of the following:"
    );
    const suffixes = ["", ".sh", ".bash"];
    builder.code(
      suffixes
        .map(suffix => fakePathForProgram(`${dependency.program}${suffix}`))
        .join("\n"),
      "text"
    );
    builder.append(
      "If `which` fails to return an executable path then you need to fix your `PATH`" +
        " Environment Variable."
    );
    builder.details(
      "Show me how to change my `PATH` environment variable.",
      builder => {
        builder.append(
          "\n<iframe width='560' height='315' src='https://www.youtube.com/embed/rJMFxIbD" +
            "e-g' frameborder='0' allow='autoplay; encrypted-media' allowfullscreen></ifram" +
            "e>\n"
        );
      }
    );
    builder.append("");
    builder.append(
      `If you know the executable path go to the ${MarkdownBuilder.createLink(
        "Configure",
        "#configure"
      )} section replace \`${fakePathForProgram(
        dependency.program
      )}\` with your specific executable path value.`
    );
    return builder;
  }

  private appendConfigSection(builder: MarkdownBuilder): MarkdownBuilder {
    builder.header("Configure", 2);
    builder.append("Choose the configuration method applicable to you.");
    builder.details("Config File", builder => {
      const beautifierName: string = this.beautifier.name;
      const dep = this.executable;
      const executableConfig = {
        [dep.name]: {
          path: fakePathForProgram(dep.program),
        },
      };
      const beautifierOptions: any = {
        ...executableConfig,
      };
      builder.append(
        `A \`.unibeautifyrc.json\` file would look like the following:`
      );
      builder.code(
        JSON.stringify(
          {
            LANGUAGE_NAME: {
              beautifiers: [beautifierName],
              [beautifierName]: beautifierOptions,
            },
          },
          null,
          2
        ),
        "json"
      );
      builder.note(
        `The \`LANGUAGE_NAME\` should be replaced with your desired supported language name, such as ${this.languages
          .slice(0, 3)
          .map(lang => `\`${lang.name}\``)
          .join(", ")}, etc.`
      );
      builder.append(
        `See ${MarkdownBuilder.createLink(
          "Install",
          "#install"
        )} section below for how to determine absolute path to the exectuable.`
      );
    });
    builder.details("Atom", builder => {
      builder.append("Coming soon.");
    });
    builder.details("Visual Studio Code", builder => {
      builder.append("Coming soon.");
    });
    return builder;
  }
  private get pkg(): object | undefined {
    return this.beautifier.package;
  }
  protected get customEditUrl() {
    return `${websiteEditUrl}/scripts/generate-docs/ExecutableDoc.ts`;
  }
  private get beautifierHomepageUrl() {
    return _.get(this.pkg, "homepage");
  }
  private get badges(): Badge[] {
    return this.executable.badges || [];
  }
  private get executableHomepageUrl(): string | undefined {
    return this.executable.homepageUrl;
  }
  private get installationUrl(): string | undefined {
    return this.executable.installationUrl;
  }
  private get bugsUrl(): string | undefined {
    return this.executable.bugsUrl;
  }
}

function fakePathForProgram(program: string): string {
  return `/absolute/path/to/${program}`;
}
