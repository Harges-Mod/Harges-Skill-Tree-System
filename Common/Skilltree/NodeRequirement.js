export default class NodeRequiriment {
  
  static Data = []
  
  constructor(level, items = null, extra = [{ type: 'none', value: 'none' }]) {
    this.level = level
    this.items = items
    this.extra = extra
  }

  /**
   * @summary Node skill requirement.
   * @param {number} level - Levels needed to unlock this node.
   * @param {?Array<Item>} [items=null] - Items needed to unlock this node.
   * @param {Array<{type: string, value: any}>} [extra=[{type:'none',value:'none'}]] - Extras for requirement (e.g. [{type: 'Hardmode', value: true}])
   * @returns {NodeRequiriment} Returns the created NodeRequiriment instance.
   */
  static Create(level, items = null, extra = [{ type: 'none', value: 'none' }]) {
    const requirementData = new NodeRequiriment(level, items, extra)
    NodeRequiriment.Data.push(requirementData)
    return requirementData
  }
}